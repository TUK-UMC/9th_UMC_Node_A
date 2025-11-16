import { StatusCodes } from "http-status-codes";
import userDto from "../dtos/user.dto.js";
import userService from "../services/user.service.js";
import { DuplicateUserEmailError } from "../error.js";
import errorHandler from "../utils/error.handler.js";


class userController {

    // 회원가입 API - 컨트롤러
    async handleUserSignUp(req, res, next) {
      /*
    #swagger.summary = '회원가입 API';
    #swagger.tags = ['Users'];
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "password", "name"],
            properties: {
              email: { type: "string", example: "user@example.com" },
              password: { type: "string", example: "securePassword123" },
              name: { type: "string", example: "홍길동" }
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "회원가입 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  id: { type: "number", example: 1 },
                  email: { type: "string", example: "user@example.com" },
                  name: { type: "string", example: "홍길동" },
                  createdAt: { type: "string", format: "date-time" }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "회원가입 실패 응답 - 이메일 중복",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "DUPLICATE_EMAIL" },
                  reason: { type: "string", example: "이미 존재하는 이메일입니다." },
                  data: { type: "object", nullable: true }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
  */
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
}

export default new userController();
