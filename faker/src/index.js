// src/index.js (최종 통합본)

// ============== 1. 기본 모듈 및 미들웨어 임포트 ==============
import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser'; 
import morgan from 'morgan'; 

// ============== 2. 컨트롤러 임포트 (기존 미션 코드) ==============
import { handleUserSignUp, handleListUserReviews } from "./controllers/user.controller.js";
import { handleStoreRegister, handleListStoreReviews } from "./controllers/store.controller.js";
import { handleReviewRegister } from "./controllers/review.controller.js";
import { handleMissionRegister, handleListStoreMissions } from "./controllers/mission.controller.js";
import { handleMissionChallenge, handleListChallengingMissions } from "./controllers/user_mission.controller.js";


// ============== 3. 환경 설정 및 앱 초기화 ==============
dotenv.config();

const app = express();
// 환경 변수에 포트가 없으면 3000번을 기본값으로 사용
const port = process.env.PORT || 3000; 


// ============== 4. 응답 헬퍼 함수 등록 (⭐ API 응답 통일 핵심) ==============
app.use((req, res, next) => {
    // 성공 응답 헬퍼
    res.success = (success) => {
      return res.json({ resultType: "SUCCESS", error: null, success });
    };

    // 실패/오류 응답 헬퍼
    res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
      return res.json({
        resultType: "FAIL",
        error: { errorCode, reason, data },
        success: null,
      });
    };

    next();
});


// ============== 5. 전역 미들웨어 등록 ==============
app.use(morgan('dev')); 
app.use(cookieParser()); 

app.use(cors()); 
app.use(express.static("public")); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));


// ============== 6. 인증 미들웨어 및 뷰 테스트 라우트 ==============
const isLogin = (req, res, next) => {
    const { username } = req.cookies; 
    if (username) {
        console.log(`[인증 성공] ${username}님, 환영합니다.`);
        next(); 
    } else {
        console.log('[인증 실패] 로그인이 필요합니다.');
        res.status(401).send('<script>alert("로그인이 필요합니다!");location.href="/login";</script>');
    }
};

app.get('/', (req, res) => { res.send(`<h1>메인 페이지</h1>...`); });
app.get('/login', (req, res) => { res.send('<h1>로그인 페이지</h1>...'); });
app.get('/mypage', isLogin, (req, res) => { res.send(`<h1>마이페이지</h1>...`); });
app.get('/set-login', (req, res) => {
    res.cookie('username', 'UMC9th', { maxAge: 3600000 }); 
    res.send('로그인 쿠키 생성 완료! <a href="/mypage">마이페이지로 이동</a>');
});
app.get('/set-logout', (req, res) => {
    res.clearCookie('username'); 
    res.send('로그아웃 완료 (쿠키 삭제). <a href="/">메인으로</a>');
});
app.get('/test', (req, res) => { res.send('Hello!'); });
app.get('/setcookie', (req, res) => {
    res.cookie('myCookie', 'hello', { maxAge: 60000 });
    res.send('쿠키가 생성되었습니다!');
});
app.get('/getcookie', (req, res) => {
    const myCookie = req.cookies.myCookie; 
    res.send(myCookie ? `당신의 쿠키: ${myCookie}` : '쿠키가 없습니다.');
});

app.post("/api/v1/users/signup", handleUserSignUp); // 회원가입 엔드포인트 처리기

app.post("/api/v1/stores", handleStoreRegister);  // 가게 등록 엔드포인트 처리기

app.post("/api/v1/stores/:storeId/reviews", handleReviewRegister); // 리뷰 등록 엔드포인트 처리기

app.post("/api/v1/stores/:storeId/missions", handleMissionRegister); // 미션 등록 엔드포인트 처리기

app.post("/api/v1/missions/:missionId/challenge", handleMissionChallenge); // 미션 챌린지 엔드포인트 처리기

app.get("/api/v1/users/:userId/missions", handleListChallengingMissions); // 도전 중 미션 목록 조회 API 

app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews); // 가게 리뷰 목록 조회 엔드포인트 처리기

app.get("/api/v1/users/:userId/reviews", handleListUserReviews);

app.get("/api/v1/stores/:storeId/missions", handleListStoreMissions); // 미션 목록 조회 API 추가

// ============== 8. 전역 오류 처리 미들웨어 (에러 핸들링 핵심) ==============
// 에러 핸들링 미들웨어는 항상 다른 라우트와 미들웨어 뒤에 위치해야 합니다.
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // 정의된 헬퍼 함수를 사용하여 통일된 오류 응답 포맷을 반환
  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "UNKNOWN_ERROR",
    reason: err.reason || err.message || "서버에서 예상치 못한 오류가 발생했습니다.",
    data: err.data || null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

