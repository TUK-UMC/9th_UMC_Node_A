import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { createReview } from "../services/review.service.js";
import { BadRequestError } from "../errors.js";

// 리뷰 추가 핸들러
export const handleCreateReview = async (req, res, next) => {
    /*
    #swagger.summary = '가게 리뷰 추가 API';
    #swagger.parameters['storeId'] = {
        in: 'path',
        description: '가게 ID',
        required: true,
        type: 'integer'
    };
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        userId: { type: "number", example: 1 },
                        rating: { type: "number", example: 4.5 },
                        content: { type: "string", example: "음식이 매우 맛있었습니다!" },
                        imageUrls: { type: "array", items: { type: "string" }, example: ["http://example.com/image1.jpg"] }
                    }
                }
            }
        }
    };
    #swagger.responses[201] = {
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
                                reviewId: { type: "number" },
                                storeId: { type: "number" },
                                userId: { type: "number" },
                                rating: { type: "number" },
                                content: { type: "string" },
                                images: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            imageId: { type: "number" },
                                            imageUrl: { type: "string" },
                                            createdAt: { type: "string", format: "date-time" }
                                        }
                                    }
                                },
                                createdAt: { type: "string", format: "date-time" }
                            }
                        }
                    }
                }
            }
        }
    };
    #swagger.responses[400] = {
        description: "리뷰 추가 실패 응답",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAIL" },
                        error: {
                            type: "object",
                            properties: {
                                errorCode: { type: "string", example: "R001" },
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
    try {
        console.log("리뷰 추가를 요청했습니다!");
        console.log("params:", req.params);
        console.log("body:", req.body);

        const storeId = parseInt(req.params.storeId);
        const userId = req.body.userId;

        if (!userId) {
            throw new BadRequestError("userId는 필수입니다.", req.body);
        }

        const reviewData = bodyToReview(req.body, storeId, userId);
        const review = await createReview(reviewData);

        res.status(StatusCodes.CREATED).success(review);
    } catch (err) {
        next(err);
    }
};