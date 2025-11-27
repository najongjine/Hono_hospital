import { Hono } from "hono";
import { AppDataSource } from "../../data-source1";
import axios from "axios";
import * as KakaoTypes from "./kakaomap_api_type";

const router = new Hono();

router.get("/search_keyword", async (c) => {
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    data: null,
    code: "",
    message: ``,
  };
  try {
    const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
    if (!KAKAO_REST_API_KEY) {
      result.success = false;
      throw new Error(
        "!!! KAKAO_REST_API_KEY is not defined in environment variables."
      );
    }
    const url = "https://dapi.kakao.com/v2/local/search/keyword.json";
    let query = String(c?.req?.query("query") ?? "치과");
    let long = String(c.req.query("long") ?? "126.80141560943788"); // 경도. x
    let lang = String(c.req.query("lang") ?? "35.17832759507573"); // 위도 y
    let radius = String(c.req.query("radius") ?? "20000");
    let category_group_code = String(
      c.req.query("category_group_code") ?? "HP8"
    );
    let sort = String(c.req.query("sort") ?? "distance");
    let page = 1;

    const params = {
      query: query,
      x: long,
      y: lang,
      radius: radius,
      category_group_code: category_group_code, // 병원 코드
      sort: sort,
      page: page,
    };

    const headers = {
      Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
    };

    const response = await axios.get(url, { params, headers });

    const places: KakaoTypes.KakaoKeywordSearchResponse = response?.data;

    console.log("검색 결과:", places);

    result.data = places;

    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.message = error?.message;
    return c.json(result);
  }
});

// API 호출 사이에 잠시 대기하기 위한 유틸리티 (카카오 API 과부하 방지)
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
/**
 * 페이지 1~45까지 순회하며 병원 데이터를 수집하여 DB에 저장
 */
router.post("/collect_hospitals", async (c) => {
  const result = {
    success: true,
    total_saved: 0,
    message: "",
  };

  const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
  if (!KAKAO_REST_API_KEY) {
    return c.json({ success: false, message: "API KEY Missing" }, 500);
  }

  // 1. 쿼리 파라미터 준비
  const query = c.req.query("query") ?? "피부과";
  const long = c.req.query("long") ?? "126.8095"; // x
  const lang = c.req.query("lang") ?? "35.1743"; // y
  const radius = c.req.query("radius") ?? "20000";
  const category_group_code = c.req.query("category_group_code") ?? "HP8";
  const sort = c.req.query("sort") ?? "distance";

  let totalSavedCount = 0;

  try {
    // 2. 1페이지부터 45페이지까지 반복
    for (let page = 1; page <= 45; page++) {
      console.log(`Searching Page: ${page}...`);

      const params = {
        query: query,
        x: long,
        y: lang,
        radius: radius,
        category_group_code: category_group_code,
        sort: sort,
        page: page,
        size: 15, // 한 페이지당 최대 개수
      };

      const headers = { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` };

      // 카카오 API 호출
      const response = await axios.get(
        "https://dapi.kakao.com/v2/local/search/keyword.json",
        { params, headers }
      );

      const data: KakaoTypes.KakaoKeywordSearchResponse = response.data;
      const documents = data.documents;

      if (!documents || documents.length === 0) {
        console.log("No more documents found.");
        break; // 데이터가 없으면 종료
      }

      // 3. 쌩쿼리(Raw Query)로 데이터 저장 (Upsert)
      // 반복문을 돌며 하나씩 쿼리를 날립니다. (Batch 처리를 원하면 쿼리 문자열을 조합해야 함)
      for (const doc of documents) {
        const xVal = parseFloat(doc.x);
        const yVal = parseFloat(doc.y);

        // SQL Injection 방지를 위해 파라미터 바인딩($1, $2...) 사용
        const sql = `
          INSERT INTO hospitals (
            id, place_name, phone, road_address_name, address_name, category_name, place_url, x, y, location
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, ST_SetSRID(ST_MakePoint($8, $9), 4326)
          )
          ON CONFLICT (id) DO UPDATE SET
            place_name = EXCLUDED.place_name,
            phone = EXCLUDED.phone,
            road_address_name = EXCLUDED.road_address_name,
            address_name = EXCLUDED.address_name,
            category_name = EXCLUDED.category_name,
            place_url = EXCLUDED.place_url,
            x = EXCLUDED.x,
            y = EXCLUDED.y,
            location = EXCLUDED.location;
        `;

        const parameters = [
          doc.id, // $1
          doc.place_name, // $2
          doc.phone, // $3
          doc.road_address_name, // $4
          doc.address_name, // $5
          doc.category_name, // $6
          doc.place_url, // $7
          xVal, // $8 (경도)
          yVal, // $9 (위도)
        ];

        // 쿼리 실행
        await AppDataSource.query(sql, parameters);
      }

      totalSavedCount += documents.length;

      // 4. 마지막 페이지인지 확인
      if (data.meta.is_end) {
        console.log("End of pages reached.");
        break;
      }

      await sleep(200);
    }

    result.total_saved = totalSavedCount;
    result.message = `Successfully saved ${totalSavedCount} hospitals from pages 1-45 (Raw Query).`;
    return c.json(result);
  } catch (error: any) {
    console.error(error);
    return c.json(
      {
        success: false,
        message: error.message,
        saved_so_far: totalSavedCount,
      },
      500
    );
  }
});
export default router;
