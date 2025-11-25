import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import passport from "passport";
import { googleStrategy, jwtStrategy } from "./auth.config.js";
import { handleUserSignUp, handleUpdateProfile, handleLogin } from "./controllers/user.controller.js";
import { handleCreateStore } from "./controllers/store.controller.js";
import { handleCreateReview } from "./controllers/review.controller.js";
import {
    handleCreateMission,
    handleChallengeMission,
} from "./controllers/mission.controller.js";
passport.use(googleStrategy);
passport.use(jwtStrategy);

const app = express();
const port = process.env.PORT;

/**
 * 공통 응답을 사용할 수 있는 헬퍼 함수 등록
 */
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

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use(morgan("dev"));
app.use(cookieParser());
app.use(passport.initialize());

app.use(
    "/docs",
    swaggerUiExpress.serve,
    swaggerUiExpress.setup({}, {
        swaggerOptions: {
            url: "/openapi.json",
        },
    })
);

const isLogin = passport.authenticate('jwt', { session: false });

app.get('/mypage', isLogin, (req, res) => {
    res.status(200).success({
        message: `인증 성공! ${req.user.name}님의 마이페이지입니다.`,
        user: req.user,
    });
});


app.get('/test', (req, res) => {
    res.send("hello!");
})


// 쿠키 만드는 라우터
app.get('/setcookie', (req, res) => {
    // 'myCookie'라는 이름으로 'hello' 값을 가진 쿠키를 생성
    res.cookie('myCookie', 'hello', { maxAge: 60000 }); // 60초간 유효
    res.send('쿠키가 생성되었습니다!');
});


// 쿠키 읽는 라우터
app.get('/getcookie', (req, res) => {
    // cookie-parser 덕분에 req.cookies 객체에서 바로 꺼내 쓸 수 있음
    const myCookie = req.cookies.myCookie;

    if (myCookie) {
        console.log(req.cookies); // { myCookie: 'hello' }
        res.send(`당신의 쿠키: ${myCookie}`);
    } else {
        res.send('쿠키가 없습니다.');
    }
});


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


app.get('/set-login', (req, res) => {
    res.cookie('username', 'UMC9th', { maxAge: 3600000 });
    res.send('로그인 쿠키(username=UMC9th) 생성 완료! <a href="/mypage">마이페이지로 이동</a>');
});


app.get('/set-logout', (req, res) => {
    res.clearCookie('username');
    res.send('로그아웃 완료 (쿠키 삭제). <a href="/">메인으로</a>');
});


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
            title: "UMC 9th",
            description: "UMC 9th Node.js 테스트 프로젝트입니다.",
        },
        host: "localhost:3000",
    };

    const result = await swaggerAutogen(options)(outputFile, routes, doc);
    res.json(result ? result.data : null);
});


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


// 1-1. 특정 지역에 가게 추가하기 API (로그인 필요)
app.post("/api/v1/stores", isLogin, handleCreateStore);

// 1-2. 가게에 리뷰 추가하기 API (로그인 필요)
app.post("/api/v1/stores/:storeId/reviews", isLogin, handleCreateReview);

// 1-3. 가게에 미션 추가하기 API (로그인 필요)
app.post("/api/v1/stores/:storeId/missions", isLogin, handleCreateMission);

// 1-4. 가게의 미션을 도전 중인 미션에 추가하기 API (로그인 필요)
app.post("/api/v1/missions/:missionId/challenge", isLogin, handleChallengeMission);

// 회원가입 (로그인 불필요)
app.post("/api/v1/users/signup", handleUserSignUp);

// 로그인 (로그인 불필요)
app.post("/api/v1/users/login", handleLogin);

// 프로필 수정 API (로그인 필요) - Google 로그인 사용자도 추가 정보 입력 가능
app.patch("/api/v1/users/profile", isLogin, handleUpdateProfile);

/**
 * 전역 오류를 처리하기 위한 미들웨어
 */
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.statusCode || 500).error({
        errorCode: err.errorCode || "unknown",
        reason: err.reason || err.message || null,
        data: err.data || null,
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
