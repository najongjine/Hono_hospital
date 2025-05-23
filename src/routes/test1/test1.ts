import { Hono } from "hono";
import { AppDataSource } from "../../data-source1";
import { YtDlp } from "ytdlp-nodejs";

const test1 = new Hono();

test1.get("/", async (c) => {
  try {
    let a: any;
    return c.json({ success: true, data: null, code: "", message: `` });
  } catch (error: any) {
    return c.json({ success: false, data: null, code: "test1", message: `!!! ${error?.message ?? "!!! test1"}` });
  }
});

test1.get("/ytdl", async (c) => {
  try {
    const ytdlp = new YtDlp();
    const output = await ytdlp.downloadAsync(
      "https://www.youtube.com/watch?v=hMax9B0BESw", // 실제 영상 ID로 교체하세요
      {
        format: "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]",
        onProgress: (progress: any) => {
          console.log("진행률:", progress);
        },
      }
    );
    return c.json({ success: true, data: null, code: "", message: `` });
  } catch (error: any) {
    return c.json({ success: false, data: null, code: "test1", message: `!!! ${error?.message ?? "!!! test1"}` });
  }
});

export default test1;
