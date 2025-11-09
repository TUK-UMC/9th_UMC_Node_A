import { StatusCodes } from "http-status-codes";
import userDto from "../dtos/user.dto.js";
import userService from "../services/user.service.js";
import { DuplicateUserEmailError } from "../error.js";


class userController {

    // 회원가입 API - 컨트롤러
    async handleUserSignUp(req, res, next) {
        try {
            console.log("회원가입을 요청했습니다!");
            console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용
              
            const user = await userService.userSignUp(userDto.bodyToUser(req.body));
            
            res.status(StatusCodes.OK).success(user);
        } catch (error) {
            // 커스텀 에러인 경우 그대로 전달, 아니면 기본 에러 형식으로 변환
            if (error instanceof DuplicateUserEmailError) {
                const customError = {
                    statusCode: StatusCodes.BAD_REQUEST,
                    errorCode: error.errorCode,
                    reason: error.reason,
                    data: error.data
                };
                next(customError);
            } else {
                // 일반 에러인 경우
                const customError = {
                    statusCode: StatusCodes.BAD_REQUEST,
                    errorCode: "USER_SIGNUP_ERROR",
                    reason: error.message || "회원가입 중 오류가 발생했습니다.",
                    data: null
                };
                next(customError);
            }
        }
    };
}

export default new userController();
