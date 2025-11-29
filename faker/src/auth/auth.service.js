// src/auth/auth.service.js

import { prisma } from "../db.config.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secret = process.env.JWT_SECRET;

// export 키워드 추가 (외부에서 사용 가능하도록 변경)
export const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: user.id }, secret, { expiresIn: '14d' });
  return { accessToken, refreshToken };
};

// 소셜 로그인 처리 함수 (DB upsert + 토큰 발급)
export const handleGoogleLogin = async (profile) => {
  const { email, name } = profile;

  if (!email) {
    throw new Error("Google email not found");
  }

  // 1. DB 작업 (upsert)
  const user = await prisma.user.upsert({
    where: { email: email },
    update: { name: name }, 
    create: {
      email,
      name,
      // password: NULL (소셜 유저)
      gender: "추후 수정",
      birth: new Date(1970, 0, 1),
      address: "추후 수정",
      detailAddress: "추후 수정",
      phoneNumber: "추후 수정",
    },
  });

  // 2. 토큰 발급
  const tokens = generateTokens(user);

  // 3. 유저 정보와 토큰 반환
  return { user, tokens };
};