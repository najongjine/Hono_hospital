import { serve } from "@hono/node-server";
import { Hono } from "hono";
import * as dotenv from "dotenv";
import { AppDataSource } from "./data-source1";
import { cors } from "hono/cors";

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: envFile });

/** import routes */
import test1 from "./routes/test1/test1.js";
import fav_hospital from "./routes/fav_hospital/fav_hospital.js";
import kakaomap_api from "./routes/kakao_api/kakaomap_api.js";
/** import routes END */

const app = new Hono();

// ✅ CORS 미들웨어 추가: 모든 origin 허용
app.use("*", cors());

/** DB 연결 */
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
/** DB 연결 END */

app.get("/", (c) => {
  return c.json("Hello Hono!");
});

/* API END Point 등록 */
app.route("/test1", test1);
app.route("/api/fav_hospital", fav_hospital);
app.route("/api/kakaomap_api", kakaomap_api);

app.onError((err, c) => {
  return c.json({
    success: false,
    data: null,
    code: "global_err",
    message: `${err?.message ?? "!!!_global_err"}`,
  });
});

const hono_port = Number(process?.env?.HONO_PORT ?? 3005);
serve(
  {
    fetch: app.fetch,
    port: hono_port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log(`process.env.NODE_ENV :${process.env.NODE_ENV}`);
  }
);
