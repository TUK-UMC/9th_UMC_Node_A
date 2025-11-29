// src/index.js

import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from "passport";

// Auth
import { initializePassport } from "./auth/index.js";
import { handleGoogleLogin } from "./auth/auth.service.js"; 

// Controllers
import { handleUserSignUp, handleListUserReviews, handleUserUpdate } from "./controllers/user.controller.js";
import { handleStoreRegister, handleListStoreReviews } from "./controllers/store.controller.js";
import { handleReviewRegister } from "./controllers/review.controller.js";
import { handleMissionRegister, handleListStoreMissions } from "./controllers/mission.controller.js";
import { handleMissionChallenge, handleListChallengingMissions } from "./controllers/user_mission.controller.js";

// 테스트 컨트롤러 Import
import { handleTest, handleSetCookie, handleGetCookie, handleGenerateTestToken } from "./controllers/test.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 1. 공통 응답 헬퍼
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

// 2. 전역 미들웨어
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 3. Passport 설정
app.use(passport.initialize());
initializePassport(); 

const authMiddleware = passport.authenticate('jwt', { session: false });


// 4. 테스트용 라우트 (Controller로 분리)
app.get('/', handleTest);
app.get('/test', handleTest);
app.get('/setcookie', handleSetCookie);
app.get('/getcookie', handleGetCookie);
app.get('/test/token/:userId', handleGenerateTestToken);


// 5. Swagger 설정
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
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null";
  const routes = ["./src/index.js"];
  const doc = {
    info: {
      title: "UMC 9th",
      description: "UMC 9th Node.js 테스트 프로젝트입니다.",
    },
    host: "localhost:3000",
    definitions: {
        ResourceNotFoundError: {
            resultType: "FAIL",
            error: { errorCode: "G001", reason: "Resource not found", data: null },
            success: null
        }
    }
  };
  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});


// 6. API 라우트 등록

// User
app.post("/api/v1/users/signup", handleUserSignUp);
app.patch("/api/v1/users", authMiddleware, handleUserUpdate); 

// Store
app.post("/api/v1/stores", authMiddleware, handleStoreRegister); 
app.post("/api/v1/stores/:storeId/reviews", authMiddleware, handleReviewRegister); 
app.post("/api/v1/stores/:storeId/missions", authMiddleware, handleMissionRegister); 

// Mission
app.post("/api/v1/missions/:missionId/challenge", authMiddleware, handleMissionChallenge); 

// 조회 (GET)
app.get("/api/v1/users/missions", authMiddleware, handleListChallengingMissions);
app.get("/api/v1/users/reviews", authMiddleware, handleListUserReviews);
app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);
app.get("/api/v1/stores/:storeId/missions", handleListStoreMissions);


// 7. 구글 OAuth2 라우트
app.get("/oauth2/login/google", passport.authenticate("google", { session: false, scope: ["email", "profile"] }));

app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login-failed",
  }),
  async (req, res, next) => {
    try {
      const googleProfile = req.user;
      const { user, tokens } = await handleGoogleLogin(googleProfile);

      res.status(200).success({
        message: "Google 로그인 성공!",
        user: { id: user.id, email: user.email, name: user.name },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      });
    } catch (error) {
      next(error);
    }
  }
);

// 8. 전역 에러 핸들러
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "UNKNOWN_ERROR",
    reason: err.reason || err.message || "서버에서 예상치 못한 오류가 발생했습니다.",
    data: err.data || null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});