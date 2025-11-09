import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import storeCtr from "./controllers/store.controller.js";
import userCtr from "./controllers/user.controller.js";
import reviewCtr from "./controllers/review.controller.js";
import missionCtr from "./controllers/mission.controller.js";

dotenv.config();


const app = express();
const port = process.env.PORT;

app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

// 미들웨어 코드들

const myLogger = (req, res, next) => {
    console.log("LOGGED");
    next();
}

app.use(myLogger);

app.get('/', (req, res) => {
    console.log("/");
    res.send('Hello UMC!');
});

app.get('/hello', (req, res) => {
    console.log("/hello");
    res.send('Hello world!');
});


// 추가하는 API들
app.post("/api/v1/users/signup", userCtr.handleUserSignUp);    // 회원가입 API
app.post("/api/v1/stores/add", storeCtr.handleStoreAdd);    // 가게 추가 API
app.post("/api/v1/reviews/add", reviewCtr.handleReviewAdd);    // 리뷰 추가 API
app.post("/api/v1/missions/add", missionCtr.handleMissionAdd);    // 가게 미션 추가 API
app.post("/api/v1/user-missions/add", missionCtr.hanldeUserMissionAdd);    // 유저가 도전중인 미션에 추가 API

// 조회하는 API들
app.get("/api/v1/stores/:storeId/reviews", storeCtr.handleListStoreReviews);  // 가게 리뷰 목록 조회 API


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

