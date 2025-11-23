// 패키지들
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import swaggerUiExpress from "swagger-ui-express";
import passport from "passport";
import { googleStrategy, jwtStrategy } from "./auth.config.js";
import { prisma } from "./db.config.js";
import fs from "fs";
import yaml from "js-yaml";

// 컨트롤러들
import storeCtr from "./controllers/store.controller.js";
import userCtr from "./controllers/user.controller.js";
import reviewCtr from "./controllers/review.controller.js";
import missionCtr from "./controllers/mission.controller.js";

dotenv.config();
passport.use(googleStrategy); // 구글 로그인 등록
passport.use(jwtStrategy); // JWT 인증 등록

// BigInt를 JSON으로 직렬화할 수 있도록 설정
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const app = express();
const port = process.env.PORT;

// Swagger YAML 파일 읽기
const openapiSpec = yaml.load(fs.readFileSync('./src/swagger/openapi.yaml', 'utf8'));

app.use(cookieParser());
app.use(morgan('dev'));     // 로그 포맷:
app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

app.use(passport.initialize()); 

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

// 인증 미들웨어
const isLogin = passport.authenticate('jwt', { session: false });

// 미들웨어 코드들

app.get('/', (req, res) => {
  res.send(`
    <h1> 메인 페이지 </h1>
    <p> 현재 9주차 진행중입니다. </p>
    <ul>
      <li> <a href="/docs"> Swagger UI </a> </li>
    </ul>
  `);
});

// Swagger UI 설정
app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(openapiSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Mont API Documentation"
  })
);

// OAuth2 관련 설정
app.get("/oauth2/login/google", 
  passport.authenticate("google", { 
    session: false 
  })
);
app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", {
	  session: false,
    failureRedirect: "/login-failed",
  }),
  (req, res) => {
    const tokens = req.user; 

    res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: {
          message: "Google 로그인 성공!",
          tokens: tokens, // { "accessToken": "...", "refreshToken": "..." }
      }
    });
  }
);

// API 라우트들
// 회원가입 및 인증 관련 (인증 불필요)
app.post("/api/v1/users/signup", userCtr.handleUserSignUp);    // 회원가입 API
app.patch("/api/v1/users/profile", isLogin, userCtr.handleUpdateProfile);  // 프로필 업데이트 API (인증 필요)

// 인증이 필요한 API들
app.post("/api/v1/stores/add", isLogin, storeCtr.handleStoreAdd);    // 가게 추가 API
app.post("/api/v1/reviews/add", isLogin, reviewCtr.handleReviewAdd);    // 리뷰 추가 API
app.post("/api/v1/missions/add", isLogin, missionCtr.handleMissionAdd);    // 가게 미션 추가 API
app.post("/api/v1/user-missions/add", isLogin, missionCtr.hanldeUserMissionAdd);    // 유저가 도전중인 미션에 추가 API

// 조회하는 API들 (인증 선택)
app.get("/api/v1/stores/:storeId/reviews", storeCtr.handleListStoreReviews);  // 가게 리뷰 목록 조회 API

// 마이페이지 (인증 필요)
app.get('/api/v1/mypage', isLogin, (req, res) => {
  res.status(200).success({
    message: `인증 성공! ${req.user.name}님의 마이페이지입니다.`,
    user: req.user,
  });
});


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

