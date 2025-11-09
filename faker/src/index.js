import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { handleUserSignUp } from "./controllers/user.controller.js";

import { handleStoreRegister } from "./controllers/store.controller.js";

import { handleReviewRegister } from "./controllers/review.controller.js";

import { handleMissionRegister } from "./controllers/mission.controller.js";

import { handleMissionChallenge } from "./controllers/user_mission.controller.js";

import { handleListStoreReviews } from "./controllers/store.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/v1/users/signup", handleUserSignUp); // 회원가입 엔드포인트 처리기

app.post("/api/v1/stores", handleStoreRegister);  // 가게 등록 엔드포인트 처리기

app.post("/api/v1/stores/:storeId/reviews", handleReviewRegister); // 리뷰 등록 엔드포인트 처리기

app.post("/api/v1/stores/:storeId/missions", handleMissionRegister); // 미션 등록 엔드포인트 처리기

app.post("/api/v1/missions/:missionId/challenge", handleMissionChallenge); // 미션 챌린지 엔드포인트 처리기

app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews); // 가게 리뷰 목록 조회 엔드포인트 처리기

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

