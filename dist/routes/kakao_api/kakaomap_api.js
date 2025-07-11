import { Hono } from "hono";
import { AppDataSource } from "../../data-source1";
import axios from "axios";
import * as KakaoTypes from "./kakaomap_api_type";
const router = new Hono();
router.get("/search_keyword", async (c) => {
    let result = {
        success: true,
        data: null,
        code: "",
        message: ``,
    };
    try {
        const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
        if (!KAKAO_REST_API_KEY) {
            result.success = false;
            throw new Error("!!! KAKAO_REST_API_KEY is not defined in environment variables.");
        }
        const url = "https://dapi.kakao.com/v2/local/search/keyword.json";
        let query = String(c?.req?.query("query") ?? "피부과");
        let long = String(c.req.query("long") ?? "126.80141560943788"); // 경도. x
        let lang = String(c.req.query("lang") ?? "35.17832759507573"); // 위도 y
        let radius = String(c.req.query("radius") ?? "2000");
        let category_group_code = String(c.req.query("category_group_code") ?? "HP8");
        let sort = String(c.req.query("sort") ?? "distance");
        const params = {
            query: query,
            x: long,
            y: lang,
            radius: radius,
            category_group_code: category_group_code, // 병원 코드
            sort: sort,
        };
        const headers = {
            Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        };
        const response = await axios.get(url, { params, headers });
        const places = response?.data;
        console.log("검색 결과:", places);
        result.data = places;
        return c.json(result);
    }
    catch (error) {
        result.success = false;
        result.message = error?.message;
        return c.json(result);
    }
});
export default router;
