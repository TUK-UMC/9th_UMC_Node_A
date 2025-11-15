// src/controllers/user.controller.js

import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp,
  listUserReviews
} from "../services/user.service.js";
export const handleUserSignUp = async (req, res, next) => {
  /*
    #swagger.summary = '회원 가입 API';
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: { type: "string" },
              name: { type: "string" },
              password: { type: "string" },
              gender: { type: "string" },
              birth: { type: "string", format: "date" },
              address: { type: "string" },
              detailAddress: { type: "string" },
              phoneNumber: { type: "string" },
              preferences: { type: "array", items: { type: "number" } }
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "회원 가입 성공 응답",
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
                  email: { type: "string" },
                  name: { type: "string" },
                  preferCategory: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "회원 가입 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U001" },
                  reason: { type: "string" },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
  */

  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); 

  try {
    const user = await userSignUp(bodyToUser(req.body));
    
    // 통일된 성공 헬퍼 함수
    res.status(StatusCodes.OK).success(user);
    
  } catch (error) {
    // 오류 발생 시 next(error)를 호출
    next(error); 
  }
};



// GET /api/v1/users/:userId/reviews 요청 처리
 
export const handleListUserReviews = async (req, res, next) => {
/*
  #swagger.summary = '사용자가 작성한 리뷰 목록 조회';
  #swagger.description = '특정 사용자가 작성한 모든 리뷰 목록을 조회합니다.';
  #swagger.parameters['userId'] = {
    in: 'path',
    description: '조회할 사용자 ID',
    required: true,
    type: 'number'
  }
  #swagger.responses[200] = {
    description: "리뷰 목록 조회 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  reviewId: { type: "number" },
                  content: { type: "string" },
                  userName: { type: "string" },
                  store: { type: "object" }
                }
              },
              description: "사용자가 작성한 리뷰 목록"
            }
          }
        }
      }
    }
  }
  #swagger.responses[404] = {
    description: "사용자 ID를 찾을 수 없는 경우",
    content: {
      "application/json": {
        schema: { $ref: "#/definitions/ResourceNotFoundError" }
      }
    }
  }
*/
  try {
    const userId = parseInt(req.params.userId, 10);
    
    // Service 계층 호출
    const reviews = await listUserReviews(userId);

    // 통일된 성공 헬퍼 함수 사용 (res.success)
    res.status(StatusCodes.OK).success(reviews);
    
  } catch (err) {
    // 오류 발생 시 next(err)를 호출
    next(err); 
  }
};