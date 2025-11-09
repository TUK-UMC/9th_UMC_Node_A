import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
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

// 미들웨어 코드들
app.get('/test', (req, res) => {
    res.send('Hello!');
  });

  const isLogin = (req, res, next) => {
    // cookie-parser가 만들어준 req.cookies 객체에서 username을 확인
    const { username } = req.cookies; 

    if (username) {
     
        console.log(`[인증 성공] ${username}님, 환영합니다.`);
        next(); 
    } else {
    
        console.log('[인증 실패] 로그인이 필요합니다.');
        res.status(401).send('<script>alert("로그인이 필요합니다!");location.href="/login";</script>');
    }
};


app.get('/', (req, res) => {
    res.send(`
        <h1>메인 페이지</h1>
        <p>이 페이지는 로그인이 필요 없습니다.</p>
        <ul>
            <li><a href="/mypage">마이페이지 (로그인 필요)</a></li>
        </ul>
    `);
});


app.get('/login', (req, res) => {
    res.send('<h1>로그인 페이지</h1><p>로그인이 필요한 페이지에서 튕겨나오면 여기로 옵니다.</p>');
});


app.get('/mypage', isLogin, (req, res) => {
    res.send(`
        <h1>마이페이지</h1>
        <p>환영합니다, ${req.cookies.username}님!</p>
        <p>이 페이지는 로그인한 사람만 볼 수 있습니다.</p>
    `);
});


app.get('/set-login', (req, res) => {
    res.cookie('username', 'UMC9th', { maxAge: 3600000 });
    res.send('로그인 쿠키(username=UMC9th) 생성 완료! <a href="/mypage">마이페이지로 이동</a>');
});


app.get('/set-logout', (req, res) => {
    res.clearCookie('username');
    res.send('로그아웃 완료 (쿠키 삭제). <a href="/">메인으로</a>');
});

// 공통 응답을 사용할 수 있는 헬퍼 함수 등록
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

