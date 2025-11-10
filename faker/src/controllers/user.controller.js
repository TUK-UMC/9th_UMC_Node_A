// src/controllers/user.controller.js

import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp,
  listUserReviews
} from "../services/user.service.js";


export const handleUserSignUp = async (req, res, next) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  try {
    // 1. Service 호출
    const user = await userSignUp(bodyToUser(req.body));
    
    // 2. 성공 시, res.status()와 res.success(data) 헬퍼 사용
    // index.js에 res.success가 등록되어 있으므로, res.json() 대신 헬퍼 사용
    res.status(StatusCodes.OK).success(user);
    
  } catch (error) {
    // 3. 오류 발생 시, next()를 이용해 전역 오류 처리 미들웨어로 전달
    next(error);
  }
};

/**
 * GET /api/v1/users/:userId/reviews 요청을 처리합니다.
 */
export const handleListUserReviews = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    
    // Service 계층 호출
    const reviews = await listUserReviews(userId);

    // 성공 시, res.success(data) 헬퍼 사용
    res.status(StatusCodes.OK).success(reviews);
    
  } catch (error) {
    // 오류 발생 시, next()를 이용해 전역 오류 처리 미들웨어로 전달
    next(error);
  }
};