import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp,
  listUserReviews
 } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const user = await userSignUp(bodyToUser(req.body));
  res.status(StatusCodes.OK).json({ result: user });
};

/**
 * GET /api/v1/users/:userId/reviews 요청을 처리합니다.
 */
export const handleListUserReviews = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Service 계층 호출
    const reviews = await listUserReviews(userId);

    res.status(StatusCodes.OK).json({
      isSuccess: true,
      code: StatusCodes.OK,
      message: "사용자 리뷰 목록 조회 성공",
      data: reviews
    });
  } catch (err) {
    next(err); // 오류 처리 미들웨어로 전달
  }
};