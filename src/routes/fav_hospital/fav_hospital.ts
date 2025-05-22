import { Hono } from "hono";
import { AppDataSource } from "../../data-source1";

const router = new Hono();

router.get("/", async (c) => {
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    data: null,
    code: "",
    message: ``,
  };
  try {
    let a: any;
    return c.json({ success: true, data: null, code: "", message: `` });
  } catch (error: any) {
    return c.json({ success: false, data: null, code: "test1", message: `!!! ${error?.message ?? "!!! test1"}` });
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
    const body = await c.req.json(); // JSON 형태로 body 파싱
    let a: any;
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.code = `upsert_hospital`;
    result.message = `!!! error on upsert_hospital. ${error?.message ?? ""}`;
    return c.json(result);
  }
});
export default router;
