import { Hono } from "hono";
import { AppDataSource } from "../../data-source1";
import * as util from "../../util/util.js";
import * as kakaotype from "../kakao_api/kakaomap_api_type";
import { FavHospital } from "../../entities/FavHospital";

const router = new Hono();

router.get("/get_fav_hospital_list", async (c) => {
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    data: null,
    code: "",
    message: ``,
  };
  try {
    const params = c.req.query();
    const favHospitalRepository = AppDataSource.getRepository(FavHospital);
    let favHospital = await favHospitalRepository.find({
      order: { createdDt: "DESC" },
      take: 1000,
    });
    result.data = favHospital;
    return c.json(result);
  } catch (error: any) {
    console.log(error);
    result.success = false;
    result.code = `get_hospital_by_id`;
    result.message = `!!! error on get_hospital_by_id. ${error?.message ?? ""}`;
    return c.json(result);
  }
});
router.get("/get_hospital_by_kakao_placeid", async (c) => {
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    data: null,
    code: "",
    message: ``,
  };
  try {
    const params = c.req.query();
    const favHospitalRepository = AppDataSource.getRepository(FavHospital);
    let favHospital = await favHospitalRepository.findOne({
      where: { id: String(params?.id) ?? "" },
    });
    result.data = favHospital;
    return c.json(result);
  } catch (error: any) {
    console.log(error);
    result.success = false;
    result.code = `get_hospital_by_id`;
    result.message = `!!! error on get_hospital_by_id. ${error?.message ?? ""}`;
    return c.json(result);
  }
});
router.post("/upsert_hospital", async (c) => {
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    data: null,
    code: "",
    message: ``,
  };
  try {
    const favHospitalRepository = AppDataSource.getRepository(FavHospital);
    let _body: any = await c.req.json(); // JSON 형태로 body 파싱
    let body: kakaotype.KakaoPlace = _body?.hospital;
    if (!body?.id) {
      result.success = false;
      result.code = `upsert_hospital`;
      result.message = `!!! invalid hospital id`;
      return c.json(result);
    }
    let kako_placedata =
      (await favHospitalRepository.findOne({
        where: { id: String(body?.id) ?? "" },
      })) ?? new FavHospital();
    kako_placedata.addressName = body?.address_name ?? "";
    kako_placedata.categoryGroupCode = body?.category_group_code ?? "";
    kako_placedata.categoryGroupName = body?.category_group_name ?? "";
    kako_placedata.categoryName = body?.category_name ?? "";
    kako_placedata.id = body?.id ?? "";
    kako_placedata.phone = body?.phone ?? "";
    kako_placedata.placeUrl = body?.place_url ?? "";
    kako_placedata.roadAddressName = body?.road_address_name ?? "";
    kako_placedata.x = body?.x ?? "";
    kako_placedata.y = body?.y ?? "";
    kako_placedata = await favHospitalRepository.save(kako_placedata);
    result.data = kako_placedata;
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.code = `upsert_hospital`;
    result.message = `!!! error on upsert_hospital. ${error?.message ?? ""}`;
    return c.json(result);
  }
});
router.post("/delete_hospital", async (c) => {
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    data: null,
    code: "",
    message: ``,
  };
  try {
    const favHospitalRepository = AppDataSource.getRepository(FavHospital);
    const body: any = await c.req.json(); // JSON 형태로 body 파싱
    let kako_placedata =
      (await favHospitalRepository.findOne({
        where: { id: String(body?.id) ?? "" },
      })) ?? new FavHospital();
    if (!kako_placedata?.idP) {
      result.success = false;
      result.code = `delete_hospital`;
      result.message = `!!! invalid hospital id`;
      return c.json(result);
    }
    await favHospitalRepository.delete(kako_placedata?.idP ?? 0);
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.code = `upsert_hospital`;
    result.message = `!!! error on upsert_hospital. ${error?.message ?? ""}`;
    return c.json(result);
  }
});
export default router;
