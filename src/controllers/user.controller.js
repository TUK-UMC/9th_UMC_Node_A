import { StatusCodes } from "http-status-codes";
import userDto from "../dtos/user.dto.js";
import userService from "../services/user.service.js";


class userController {

    // 회원가입 API - 컨트롤러
    async handleUserSignUp(req, res, next) {
        console.log("User SignUp Request Received");
        console.log("body: ",req.body);

        const user = await userService.userSignUp(userDto.bodyToUser(req.body));
        res.status(StatusCodes.OK).json({ result: user });
    };
}

export default new userController();
