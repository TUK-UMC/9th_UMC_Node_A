import { StatusCodes } from "http-status-codes";
import storeService from "../services/store.service.js";
import storeDto from "../dtos/store.dto.js";
import { StoreAlreadyExistsError } from "../error.js";
import errorHandler from "../utils/error.handler.js";

class storeController {

    // 가게 추가 API - 컨트롤러
    async handleStoreAdd (req, res, next) {
      /*
    #swagger.summary = '가게 추가 API';
    #swagger.tags = ['Stores'];
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["name", "address"],
            properties: {
              name: { type: "string", example: "김밥천국 강남점" },
              address: { type: "string", example: "서울시 강남구 테헤란로" },
              category: { type: "string", example: "한식" },
              phone: { type: "string", example: "02-1234-5678" }
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "가게 추가 성공 응답",
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
                  result: {
                    type: "object",
                    properties: {
                      id: { type: "number", example: 1 },
                      name: { type: "string", example: "김밥천국 강남점" },
                      address: { type: "string", example: "서울시 강남구 테헤란로" },
                      category: { type: "string", example: "Korean" },
                      phone: { type: "string", example: "02-1234-5678" },
                      createdAt: { type: "string", format: "date-time" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "가게 추가 실패 응답 - 가게 이미 존재",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "STORE_ALREADY_EXISTS" },
                  reason: { type: "string", example: "이미 존재하는 가게입니다." },
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
            console.log("가게 추가를 요청합니다.");
            console.log("body: ", req.body);

            const store = await storeService.storeAdd(storeDto.bodyToStore(req.body));
            res.status(StatusCodes.OK).success({result: store});
        } catch (error) {
            const customError = errorHandler.handle(
                error,
                [StoreAlreadyExistsError],
                "STORE_ADD_ERROR",
                "가게 추가 중 오류가 발생했습니다."
            );
            next(customError);
        }
    };
    
    // 가게 리뷰 목록 조회 API - 컨트롤러
    async handleListStoreReviews(req, res, next) {
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
            const reviews = await storeService.listStoreReviews(
            parseInt(req.params.storeId), 
            typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
            );
            res.status(StatusCodes.OK).success(reviews);
        } catch (error) {
            error.statusCode = error.statusCode || StatusCodes.BAD_REQUEST;
            error.errorCode = error.errorCode || "STORE_REVIEWS_ERROR";
            error.reason = error.reason || error.message;
            next(error);
        }
    };
}

export default new storeController();