import { Hono } from "hono";
import { AppDataSource } from "../../data-source1";
import { TStores } from "../../entities/TStores";
import axios from "axios";
import { TMedicalSpecCode } from "../../entities/TMedicalSpecCode";
import { THospital } from "../../entities/THospital";
import { THospitalMedicalcodes } from "../../entities/THospitalMedicalcodes";
import { Code } from "typeorm";

/**
 * https://www.data.go.kr/data/15000736/openapi.do
 * 
 * ★ 진료과목 : D001:내과, D002:소아청소년과, D003:신경과, D004:정신건강의학과, D005:피부과, D006:외
과, D007:흉부외과, D008:정형외과, D009:신경외과, D010:성형외과, D011:산부인과, D012:안과, D013:이비
인후과, D014:비뇨기과, D016:재활의학과, D017:마취통증의학과, D018:영상의학과, D019:치료방사선과, 
D020:임상병리과, D021:해부병리과, D022:가정의학과, D023:핵의학과, D024:응급의학과, D026:치과, 
D034:구강악안면외과
 */

const test1 = new Hono();

test1.get("/hospital_detail", async (c) => {
  try {
    const serviceKey = "K60fwXwUfeie+c5RPS5jl2C3VL9WHVCpNlwzN87iA10pdJUZ3zxgCBWc+Rsaw9PAbY3plvzstYZbAwBdhTNXaQ==";
    const url = "http://apis.data.go.kr/B552657/HsptlAsembySearchService/getHsptlBassInfoInqire";

    const params = {
      serviceKey: serviceKey,
      //HPID: "A1501745",
      pageNo: "11",
      numOfRows: "10",
    };

    //const response = await axios.get(url + queryParams);
    const response = await axios.get(url, {
      params,
    });

    console.log("응답 코드:", response.status);
    console.log("응답 데이터:", response.data);
    return c.json({ success: true, data: response.data, code: "", message: `` });
  } catch (error: any) {
    return c.json({ success: false, data: null, code: "test1", message: `!!! ${error?.message ?? "!!! test1"}` });
  }
});

/**
 *  {
      dutyAddr: '광주광역시 광산구 풍영정길 147 (신창동)',
      dutyDiv: 'B',
      dutyDivNam: '병원',
      dutyEmcls: 'G099',
      dutyEmclsName: '응급의료기관 이외',
      dutyEryn: 2,
      dutyInf: '본원은 정신건강의학과 진료기관입니다.',
      dutyMapimg: '산동교와 광신대교 사이 영산강변에 위치',
      dutyName: '신창사랑병원',
      dutyTel1: '062-960-7500',
      dutyTime1c: 1800,
      dutyTime1s: '0900',
      dutyTime2c: 1800,
      dutyTime2s: '0900',
      dutyTime3c: 1800,
      dutyTime3s: '0900',
      dutyTime4c: 1800,
      dutyTime4s: '0900',
      dutyTime5c: 1800,
      dutyTime5s: '0900',
      hpid: 'A1501745',
      postCdn1: 622,
      postCdn2: '91 ',
      rnum: 10,
      wgs84Lat: 35.18307760820228,
      wgs84Lon: 126.8504788926482
    }
 */
test1.get("/hospitals", async (c) => {
  try {
    const serviceKey = "K60fwXwUfeie+c5RPS5jl2C3VL9WHVCpNlwzN87iA10pdJUZ3zxgCBWc+Rsaw9PAbY3plvzstYZbAwBdhTNXaQ==";
    const url = "http://apis.data.go.kr/B552657/HsptlAsembySearchService/getHsptlMdcncListInfoInqire";
    const medicalCode = `D026`;

    const params = {
      serviceKey: serviceKey,
      Q0: "광주광역시",
      //Q1: "광산구",
      //QZ: "B",
      QD: medicalCode, // 진료과목. CODE_MST의'D000' 참조(D001~D029)
      //QT: "1",
      //QN: "삼성병원",
      //ORD: "NAME",
      pageNo: "1",
      numOfRows: "50000",
    };

    const response = await axios.get(url, {
      params,
    });
    let data = response?.data;
    return c.json({ success: true, data: data, code: "", message: `` });
  } catch (error: any) {
    return c.json({ success: false, data: null, code: "test1", message: `!!! ${error?.message ?? "!!! test1"}` });
  }
});

test1.get("/insert_medicalcodes", async (c) => {
  try {
    let codes = `D001:내과, D002:소아청소년과, D003:신경과, D004:정신건강의학과, D005:피부과, D006:외
과, D007:흉부외과, D008:정형외과, D009:신경외과, D010:성형외과, D011:산부인과, D012:안과, D013:이비
인후과, D014:비뇨기과, D016:재활의학과, D017:마취통증의학과, D018:영상의학과, D019:치료방사선과, 
D020:임상병리과, D021:해부병리과, D022:가정의학과, D023:핵의학과, D024:응급의학과, D026:치과, 
D034:구강악안면외과`;
    let codelist = codes.split(",");
    for (const e of codelist) {
      let dummy1 = e.split(":");
      let code = dummy1[0].trim();
      let name = dummy1[1].trim();

      let newCodeData = new TMedicalSpecCode();
      newCodeData.code = code;
      newCodeData.name = name;
      console.log(`${newCodeData.code} : ${newCodeData.name}`);
      const medicalCodeRepository = AppDataSource.getRepository(TMedicalSpecCode);
      let existData = await medicalCodeRepository.findOne({ where: { code: newCodeData.code } });
      if (!existData?.code) {
        await medicalCodeRepository.save(newCodeData);
      }
    }

    return c.json({ success: true, data: codelist, code: "", message: `` });
  } catch (error: any) {
    return c.json({ success: false, data: null, code: "test1", message: `!!! ${error?.message ?? "!!! test1"}` });
  }
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test1.get("/insert_hospitals", async (c) => {
  type HospitalData = {
    dutyAddr: string;
    dutyDiv: string;
    dutyDivNam: string;
    dutyEmcls: string;
    dutyEmclsName: string;
    dutyEryn: number; // 또는 boolean 으로 바꿔도 됨 (0 또는 1이라면 number)
    dutyName: string;
    dutyTel1: string;
    dutyTel3: string;

    dutyTime1s: string;
    dutyTime1c: number;
    dutyTime2s: string;
    dutyTime2c: number;
    dutyTime3s: string;
    dutyTime3c: number;
    dutyTime4s: string;
    dutyTime4c: number;
    dutyTime5s: string;
    dutyTime5c: number;
    dutyTime6s: string;
    dutyTime6c: number;

    hpid: string;
    postCdn1: number;
    postCdn2: string;
    rnum: number;

    wgs84Lat: number;
    wgs84Lon: number;
  };

  let result: {
    success: boolean;
    data: any;
    code: string;
    message: string;
  } = {
    success: true,
    data: null,
    code: "",
    message: ``,
  };
  try {
    let medicalCode = `D004`;
    const medicalCodeRepository = AppDataSource.getRepository(TMedicalSpecCode);
    const hospitalRepository = AppDataSource.getRepository(THospital);
    const hospitalMedicalcodeRepository = AppDataSource.getRepository(THospitalMedicalcodes);

    //const codeData = await medicalCodeRepository.findOne({ where: { code: medicalCode } });
    const codedataList = await medicalCodeRepository.find();
    for (const codeData of codedataList) {
      if (!codeData?.id) {
        result.success = false;
        throw Error("!!! codeData doesn't exist");
      }

      const serviceKey = "K60fwXwUfeie+c5RPS5jl2C3VL9WHVCpNlwzN87iA10pdJUZ3zxgCBWc+Rsaw9PAbY3plvzstYZbAwBdhTNXaQ==";
      const url = "http://apis.data.go.kr/B552657/HsptlAsembySearchService/getHsptlMdcncListInfoInqire";
      console.log(`## codeData?.code: ${codeData?.code}`);
      const params = {
        serviceKey: serviceKey,
        Q0: "광주광역시",
        //Q1: "광산구",
        //QZ: "B",
        QD: codeData?.code ?? "", // 진료과목. CODE_MST의'D000' 참조(D001~D029)
        //QT: "1",
        //QN: "삼성병원",
        //ORD: "NAME",
        pageNo: "1",
        numOfRows: "100000",
      };

      const response = await axios.get(url, {
        params,
      });

      let data = response?.data?.response?.body?.items?.item ?? [];
      if (!Array.isArray(data) && data?.hpid) {
        let e: HospitalData = data;
        console.log(`## single`);
        const existHospital = await hospitalRepository.findOne({ where: { hpid: e.hpid } });

        let s_newHospitalData = new THospital();
        if (!existHospital?.id) {
          s_newHospitalData.dutyAddr = e.dutyAddr;
          s_newHospitalData.dutyDiv = e.dutyDiv;
          s_newHospitalData.dutyDivNam = e.dutyDivNam;
          s_newHospitalData.dutyEmcls = e.dutyEmcls;
          s_newHospitalData.dutyEmclsName = e.dutyEmclsName;
          s_newHospitalData.dutyEryn = Number(e.dutyEryn) > 0 ? true : false;
          s_newHospitalData.dutyName = e.dutyName;
          s_newHospitalData.dutyTel1 = e.dutyTel1;
          s_newHospitalData.dutyTel3 = e.dutyTel3;
          s_newHospitalData.dutyTime1c = e.dutyTime1c + "";
          s_newHospitalData.dutyTime1s = e.dutyTime1s + "";
          s_newHospitalData.dutyTime2c = e.dutyTime2c + "";
          s_newHospitalData.dutyTime2s = e.dutyTime2s + "";
          s_newHospitalData.dutyTime3c = e.dutyTime3c + "";
          s_newHospitalData.dutyTime3s = e.dutyTime3s + "";
          s_newHospitalData.dutyTime4c = e.dutyTime4c + "";
          s_newHospitalData.dutyTime4s = e.dutyTime4s + "";
          s_newHospitalData.dutyTime5c = e.dutyTime5c + "";
          s_newHospitalData.dutyTime5s = e.dutyTime5s + "";
          s_newHospitalData.dutyTime6c = e.dutyTime6c + "";
          s_newHospitalData.dutyTime6s = e.dutyTime6s + "";
          s_newHospitalData.hpid = e.hpid;
          s_newHospitalData.wgs84Lon = e.wgs84Lon;
          s_newHospitalData.wgs84Lat = e.wgs84Lat;
          s_newHospitalData = await hospitalRepository.save(s_newHospitalData);
        }
        try {
          let hospital_codes = new THospitalMedicalcodes();
          if (existHospital?.id) hospital_codes.hospital = existHospital;
          else hospital_codes.hospital = s_newHospitalData;
          hospital_codes.medicalSpecCode = codeData;
          hospital_codes = await hospitalMedicalcodeRepository.save(hospital_codes);
        } catch (error) {}
      }
      if (Array.isArray(data)) {
        for (const _e of data) {
          if (!_e?.hpid) continue;
          console.log(`## list`);
          let e: HospitalData = _e;
          const existHospital = await hospitalRepository.findOne({ where: { hpid: e.hpid } });
          let newHospitalData = new THospital();
          if (!existHospital?.id) {
            newHospitalData.dutyAddr = e.dutyAddr;
            newHospitalData.dutyDiv = e.dutyDiv;
            newHospitalData.dutyDivNam = e.dutyDivNam;
            newHospitalData.dutyEmcls = e.dutyEmcls;
            newHospitalData.dutyEmclsName = e.dutyEmclsName;
            newHospitalData.dutyEryn = Number(e.dutyEryn) > 0 ? true : false;
            newHospitalData.dutyName = e.dutyName;
            newHospitalData.dutyTel1 = e.dutyTel1;
            newHospitalData.dutyTel3 = e.dutyTel3;
            newHospitalData.dutyTime1c = e.dutyTime1c + "";
            newHospitalData.dutyTime1s = e.dutyTime1s + "";
            newHospitalData.dutyTime2c = e.dutyTime2c + "";
            newHospitalData.dutyTime2s = e.dutyTime2s + "";
            newHospitalData.dutyTime3c = e.dutyTime3c + "";
            newHospitalData.dutyTime3s = e.dutyTime3s + "";
            newHospitalData.dutyTime4c = e.dutyTime4c + "";
            newHospitalData.dutyTime4s = e.dutyTime4s + "";
            newHospitalData.dutyTime5c = e.dutyTime5c + "";
            newHospitalData.dutyTime5s = e.dutyTime5s + "";
            newHospitalData.dutyTime6c = e.dutyTime6c + "";
            newHospitalData.dutyTime6s = e.dutyTime6s + "";
            newHospitalData.hpid = e.hpid;
            newHospitalData.wgs84Lon = e.wgs84Lon;
            newHospitalData.wgs84Lat = e.wgs84Lat;
            await hospitalRepository.save(newHospitalData);
          }
          try {
            let hospital_codes = new THospitalMedicalcodes();
            if (existHospital?.id) hospital_codes.hospital = existHospital;
            else hospital_codes.hospital = newHospitalData;
            hospital_codes.medicalSpecCode = codeData;
            hospital_codes = await hospitalMedicalcodeRepository.save(hospital_codes);
          } catch (error) {}
        }
      }

      await sleep(2000);
    }

    await AppDataSource.query(`
UPDATE t_hospital
  SET location = ST_SetSRID(ST_MakePoint(wgs84_lon, wgs84_lat), 4326)
  WHERE wgs84_lon IS NOT NULL AND wgs84_lat IS NOT NULL;
      `);
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.message = error?.message;
    return c.json(result);
  }
});
export default test1;
