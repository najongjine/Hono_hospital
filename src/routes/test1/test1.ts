import { Hono } from "hono";
import { AppDataSource } from "../../data-source1";

const test1 = new Hono();

test1.get("/", async (c) => {
  try {
    let a: any;
    return c.json({ success: true, data: null, code: "", message: `` });
  } catch (error: any) {
    return c.json({ success: false, data: null, code: "test1", message: `!!! ${error?.message ?? "!!! test1"}` });
  }
});

export default test1;
