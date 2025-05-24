import { Hono } from "hono";
import { AppDataSource } from "../../data-source1";
import { YtDlp } from "ytdlp-nodejs";
import { serveStatic } from "hono/serve-static";
import { createReadStream, unlink } from "fs";
import { stat } from "fs/promises";
import { pipeline } from "stream/promises";
import * as path from "path";

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

test1.get("/ytdl_v2", async (c) => {
  const videoUrl = "https://www.youtube.com/watch?v=hMax9B0BESw";
  const outputPath = path.join(process.cwd(), "tmp", "video.mp4");

  try {
    const ytdlp = new YtDlp();
    await ytdlp.downloadAsync(videoUrl, {
      output: outputPath,
      format: "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]",
      onProgress: (progress: any) => {
        console.log("진행률:", progress);
      },
    });

    // 파일 정보 가져오기
    const fileStats = await stat(outputPath);

    // 응답 헤더 설정
    c.header("Content-Type", "video/mp4");
    c.header("Content-Length", fileStats.size.toString());
    c.header("Content-Disposition", 'attachment; filename="video.mp4"');

    // 파일 스트림을 응답으로 전송
    const fileStream: any = createReadStream(outputPath);
    return c.body(fileStream);
  } catch (error: any) {
    console.error("다운로드 오류:", error);
    return c.json({
      success: false,
      data: null,
      code: "DOWNLOAD_ERROR",
      message: error?.message ?? "다운로드 중 오류가 발생했습니다.",
    });
  }
});

export default test1;
