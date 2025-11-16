import { StatusCodes } from "http-status-codes";
import reviewService from "../services/review.service.js";
import reviewDto from "../dtos/review.dto.js";
import { StoreNotFoundError } from "../error.js";
import errorHandler from "../utils/error.handler.js";


class reviewController {
    // 리뷰 추가 API - 컨트롤러
    async handleReviewAdd (req, res, next) {
      /*
    #swagger.summary = '리뷰 추가 API';
    #swagger.tags = ['Reviews'];
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["storeId", "userId", "content"],
            properties: {
              storeId: { type: "number", example: 1 },
              userId: { type: "number", example: 1 },
              content: { type: "string", example: "맛있고 친절합니다!" }
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "리뷰 추가 성공 응답",
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
                      storeId: { type: "number", example: 1 },
                      userId: { type: "number", example: 1 },
                      content: { type: "string", example: "맛있고 친절합니다!" },
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
      description: "리뷰 추가 실패 응답 - 가게 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "STORE_NOT_FOUND" },
                  reason: { type: "string", example: "존재하지 않는 가게입니다." },
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
            console.log("리뷰 추가를 요청합니다.");
            console.log("body: ", req.body);
            
            const review = await reviewService.reviewAdd(reviewDto.bodyToReview(req.body));
            res.status(StatusCodes.OK).success({ result: review });
        } catch (error) {
            const customError = errorHandler.handle(
                error,
                [StoreNotFoundError],
                "REVIEW_ADD_ERROR",
                "리뷰 추가 중 오류가 발생했습니다."
            );
            next(customError);
        }
    }

    // 리뷰 목록 조회 API - 컨트롤러
    async handleListStoreReviews (req, res, next) {
      /*
    #swagger.summary = '가게 리뷰 목록 조회 API';
    #swagger.tags = ['Reviews'];
    #swagger.parameters['storeId'] = {
      in: 'path',
      required: true,
      schema: { type: 'number' },
      description: '조회할 가게 ID'
    };
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
                    id: { type: "number", example: 1 },
                    store: { type: "object", properties: { id: { type: "number", example: 1 }, name: { type: "string", example: "신촌 맛집" } } },
                    user: { type: "object", properties: { id: { type: "number", example: 1 }, email: { type: "string", example: "user@example.com" }, name: { type: "string", example: "홍길동" } } },
                    content: { type: "string", example: "맛있습니다!" },
                    createdAt: { type: "string", format: "date-time" }
                  }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "리뷰 목록 조회 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "REVIEW_LIST_ERROR" },
                  reason: { type: "string", example: "리뷰 목록 조회 중 오류가 발생했습니다." },
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
            const reviews = await reviewService.listStoreReviews(
                req.params.storeId
            );

            res.status(StatusCodes.OK).success(reviews);
        } catch (error) {
            error.statusCode = error.statusCode || StatusCodes.BAD_REQUEST;
            error.errorCode = error.errorCode || "REVIEW_LIST_ERROR";
            error.reason = error.reason || error.message;
            next(error);
        }
    }
}


export default new reviewController();