// src/controllers/store.controller.js 

import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { registerStore, listStoreReviews } from "../services/store.service.js"; 

export const handleStoreRegister = async (req, res, next) => {
/*
#swagger.summary = '가게 등록 API';
#swagger.description = '새로운 가게 정보를 등록합니다.';
#swagger.requestBody = {
  required: true,
  content: {
    "application/json": {
      schema: {
      type: "object",
      required: ["name", "rating", "regionId"],
        properties: {
          name: { type: "string", example: "마라탕" },
          address: { type: "string", example: "서울시 강남구" },
          rating: { type: "number", example: 4.5 },
          regionId: { type: "number", example: 1 }
          }
        }
      }
    }
}
#swagger.responses[201] = {
  description: "가게 등록 성공 응답",
  content: {
    "application/json": {
    schema: {
    type: "object",
      properties: {
        resultType: { type: "string", example: "SUCCESS" },
        success: { type: "object", properties: { storeId: { type: "number" }, name: { type: "string" } } }
        }
      }
    }
  }
}
#swagger.responses[400] = {
  description: "가게 등록 실패 응답 (필수 필드 누락)",
    content: {
    "application/json": {
    schema: { $ref: "#/definitions/InvalidInputError" } // 커스텀 에러 정의 참조
     }
    }
  }
}
*/
  try {
    console.log("새로운 가게 등록을 요청했습니다!");
    console.log("body:", req.body);
    
    // DTO를 이용해 요청 본문을 Service용 객체로 변환
    const storeData = bodyToStore(req.body);
    
    // Service 호출 및 등록된 가게 정보 받기
    const store = await registerStore(storeData); 
    
    // 응답 통일
    res.status(StatusCodes.CREATED).success(store);

  } catch (error) {
    
    next(error);
  }
};

export const handleListStoreReviews = async (req, res, next) => {
  /*
    #swagger.summary = '상점 리뷰 목록 조회 API';
    #swagger.responses[200] = {
      description: "상점 리뷰 목록 조회 성공 응답",
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
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        store: { type: "object", properties: { id: { type: "number" }, name: { type: "string" } } },
                        user: { type: "object", properties: { id: { type: "number" }, email: { type: "string" }, name: { type: "string" } } },
                        content: { type: "string" }
                      }
                    }
                  },
                  pagination: { type: "object", properties: { cursor: { type: "number", nullable: true } }}
                }
              }
            }
          }
        }
      }
    };
  */
  try {
    const storeId = parseInt(req.params.storeId, 10);
    
    // Query Parameter에서 cursor 값을 추출
    const cursor = (typeof req.query.cursor === "string") 
        ? parseInt(req.query.cursor, 10) 
        : 0; 

    // Service 호출 시 storeId, cursor 값을 전달
    const reviews = await listStoreReviews(storeId, cursor); 

    // 통일된 성공 헬퍼 함수 사용 (200 OK)
    res.status(StatusCodes.OK).success(reviews); 

  } catch (error) {
    // 전역 오류 처리 위임
    next(error);
  }
};