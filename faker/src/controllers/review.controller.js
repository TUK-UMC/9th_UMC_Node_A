// src/controllers/review.controller.js

import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { registerReview } from "../services/review.service.js";

export const handleReviewRegister = async (req, res, next) => {
/*
#swagger.summary = '리뷰 등록 API';
#swagger.description = '특정 가게에 리뷰를 작성합니다. (사용자 ID는 Service에서 가정)';
#swagger.parameters['storeId'] = {
  in: 'path',
  description: '리뷰를 작성할 가게 ID',
  required: true,
  type: 'number'
}
#swagger.requestBody = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          rating: { type: "number", example: 4.5, description: "평점 (1.0 ~ 5.0)" },
          content: { type: "string", example: "음식이 정말 맛있었어요!", nullable: true }
        },
        required: ["rating"] // 평점은 필수라고 가정
      }
    }
  }
}
#swagger.responses[201] = {
  description: "리뷰 등록 성공 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "SUCCESS" },
          success: { $ref: "#/definitions/ReviewResponse" } // Review DTO 참조
        }
      }
    }
  }
}
#swagger.responses[404] = {
  description: "가게 ID를 찾을 수 없는 경우",
  content: {
    "application/json": {
      schema: { $ref: "#/definitions/ResourceNotFoundError" } 
    }
  }
}
#swagger.responses[400] = {
  description: "유효성 검사 실패 (평점 누락 등)",
  content: {
    "application/json": {
      schema: { $ref: "#/definitions/InvalidInputError" } 
    }
  }
}
*/
  try {
    // 1. Path Parameter에서 storeId 획득 (숫자형으로 변환)
    const storeId = parseInt(req.params.storeId, 10);
    
    console.log(`가게 ID ${storeId}에 리뷰 등록을 요청했습니다!`);
    console.log("body:", req.body);
    
    // 2. DTO를 이용해 요청 본문을 Service용 객체로 변환
    const reviewData = bodyToReview(req.body);
    
    // 3. Service 호출 및 등록된 리뷰 정보 받기
    const review = await registerReview(storeId, reviewData); 
    
    res.status(StatusCodes.CREATED).json({ 
        message: "리뷰가 성공적으로 등록되었습니다.",
        result: review 
    });

  } catch (error) {
    // 에러 핸들링
    res.status(StatusCodes.BAD_REQUEST).json({ 
        isSuccess: false,
        code: StatusCodes.BAD_REQUEST,
        message: error.message 
    });
  }
};