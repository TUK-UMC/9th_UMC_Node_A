import "dotenv/config";

import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { prisma } from "../../db.config.js";

const jwtOptions = {
  // 요청 헤더의 Authorization: Bearer <token> 에서 토큰 추출.
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // 토큰 서명을 확인할 때 사용할 비밀 키. (.env에 정의)
  secretOrKey: process.env.JWT_SECRET,
};

export const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    // 토큰의 payload에 있는 id로 사용자를 찾음.
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (user) {
      // 사용자가 존재하면 인증 성공 (req.user에 user 객체가 들어감)
      return done(null, user);
    } else {
      // 사용자가 없으면 인증 실패
      return done(null, false);
    }
  } catch (err) {
    // 에러 발생 시 인증 실패
    return done(err, false);
  }
});