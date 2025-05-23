import { Hono } from "hono";
import { AppDataSource } from "../../data-source1";
import * as util from "../../util/util.js";
import * as kakaotype from "../kakao_api/kakaomap_api_type";
import { FavHospital } from "../../entities/FavHospital";

const router = new Hono();

router.get("/get_hospital_by_hid", async (c) => {
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    data: null,
    code: "",
    message: ``,
  };
  try {
    const params = c.req.query();
    const favHospitalRepository = AppDataSource.getRepository(FavHospital);
    let favHospital = await favHospitalRepository.findOne({ where: { id: String(params?.id) ?? "" } });
    result.data = favHospital;
    return c.json(result);
  } catch (error: any) {
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
    const body: any = await c.req.json(); // JSON 형태로 body 파싱
    let kako_placedata = (await favHospitalRepository.findOne({ where: { id: String(body?.id) ?? "" } })) ?? new FavHospital();
    util.deepCopyMatchingKeys(kako_placedata, body);
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
export default router;
