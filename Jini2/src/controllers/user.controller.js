import { StatusCodes } from "http-status-codes";
import { bodyToUser, bodyToUserUpdate } from "../dtos/user.dto.js";
import { userSignUp, userUpdateProfile, userLogin } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
    try {
        console.log("회원가입을 요청했습니다!");
        console.log("body:", req.body);

        const user = await userSignUp(bodyToUser(req.body));

        res.status(StatusCodes.OK).success(user);
    } catch (err) {
        next(err);
    }
};

export const handleLogin = async (req, res, next) => {
    try {
        console.log("로그인을 요청했습니다!");
        console.log("body:", req.body);

        const { email, password } = req.body;
        const result = await userLogin(email, password);

        res.status(StatusCodes.OK).success(result);
    } catch (err) {
        next(err);
    }
};

export const handleUpdateProfile = async (req, res, next) => {
    try {
        console.log("프로필 수정을 요청했습니다!");
        console.log("user:", req.user);
        console.log("body:", req.body);

        const userId = req.user.userId;
        const userData = bodyToUserUpdate(req.body);
        const user = await userUpdateProfile(userId, userData);

        res.status(StatusCodes.OK).success(user);
    } catch (err) {
        next(err);
    }
};
