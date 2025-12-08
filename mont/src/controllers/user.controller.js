import { StatusCodes } from "http-status-codes";
import userDto from "../dtos/user.dto.js";
import userService from "../services/user.service.js";
import { DuplicateUserEmailError } from "../error.js";
import errorHandler from "../utils/error.handler.js";


class userController {

    // 회원가입 API - 컨트롤러
    async handleUserSignUp(req, res, next) {
        try {
            console.log("회원가입을 요청했습니다!");
            console.log("body:", req.body);
              
            const user = await userService.userSignUp(userDto.bodyToUser(req.body));
            
            res.status(StatusCodes.OK).success(user);
        } catch (error) {
            const customError = errorHandler.handle(
                error,
                [DuplicateUserEmailError],
                "USER_SIGNUP_ERROR",
                "회원가입 중 오류가 발생했습니다."
            );
            next(customError);
        }
    };

    // 프로필 업데이트 API - 컨트롤러
    async handleUpdateProfile(req, res, next) {
        try {
            console.log("프로필 업데이트를 요청했습니다!");
            console.log("body:", req.body);
            console.log("user:", req.user);
              
            const updatedUser = await userService.updateProfile(req.user.id, req.body);
            
            res.status(StatusCodes.OK).success(updatedUser);
        } catch (error) {
            const customError = errorHandler.handle(
                error,
                [],
                "PROFILE_UPDATE_ERROR",
                "프로필 업데이트 중 오류가 발생했습니다."
            );
            next(customError);
        }
    };
}

export default new userController();
