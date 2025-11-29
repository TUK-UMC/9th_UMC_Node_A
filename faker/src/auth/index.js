// src/auth/index.js

import passport from "passport";
import { googleStrategy } from "./strategies/google.strategy.js";
// import { kakaoStrategy } from "./strategies/kakao.strategy.js";

import { jwtStrategy } from "./strategies/jwt.strategy.js"; // 기존 JWT 전략 파일 이동

export const initializePassport = () => {
  // 1. 구글 전략 등록
  passport.use(googleStrategy);
  
  // 2. 카카오 전략 등록
  // passport.use(kakaoStrategy);

  // 3. JWT 전략 등록
  passport.use(jwtStrategy);
};