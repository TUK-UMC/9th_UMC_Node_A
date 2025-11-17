// 패키지들
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";

// 컨트롤러들
import storeCtr from "./controllers/store.controller.js";
import userCtr from "./controllers/user.controller.js";
import reviewCtr from "./controllers/review.controller.js";
import missionCtr from "./controllers/mission.controller.js";


dotenv.config();


const app = express();
const port = process.env.PORT;

app.use(cookieParser());
app.use(morgan('dev'));     // 로그 포맷:
app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});

// 미들웨어 코드들

app.get('/', (req, res) => {
  res.send(`
    <h1> 메인 페이지 </h1>
    <p> 현재 8주차 진행중입니다. </p>
    <ul>
      <li> <a href="/docs"> Swagger UI </a> </li>
    </ul>
  `);
});

app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup({}, {
    swaggerOptions: {
      url: "/openapi.json",
    },
  })
);

app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
  const routes = ["./src/index.js"];
  const doc = {
    info: {
      title: "UMC 9th - Node.js A팀의 Mont",
      description: "테스트"
    },
    host: "localhost:3000",
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});

// 추가하는 API들
app.post("/api/v1/users/signup", userCtr.handleUserSignUp);    // 회원가입 API
app.post("/api/v1/stores/add", storeCtr.handleStoreAdd);    // 가게 추가 API
app.post("/api/v1/reviews/add", reviewCtr.handleReviewAdd);    // 리뷰 추가 API
app.post("/api/v1/missions/add", missionCtr.handleMissionAdd);    // 가게 미션 추가 API
app.post("/api/v1/user-missions/add", missionCtr.hanldeUserMissionAdd);    // 유저가 도전중인 미션에 추가 API

// 조회하는 API들
app.get("/api/v1/stores/:storeId/reviews", storeCtr.handleListStoreReviews);  // 가게 리뷰 목록 조회 API

// 전역 오류를 처리하기 위한 미들웨어 (모든 라우트 핸들러 이후에 등록)
app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }

    const statusCode = err.statusCode || 500;
    const errorCode = err.errorCode || "unknown";
    const reason = err.reason || err.message || null;
    const data = err.data || null;
 
    res.status(statusCode).error({
      errorCode,
      reason,
      data,
    });
  });


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

