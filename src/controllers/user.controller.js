import { StatusCodes } from "http-status-codes";

class userController {
    async handleUserSignUp(req, res, next) {
        console.log("User SignUp Request Received");
        console.log("body: ",req.body);

        const user = await userSignUp(bodyToUser(req.body));
        res.status(StatusCodes.OK).json({ result: user });
    };
}

export default new userController();