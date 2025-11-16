import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { createStore } from "../services/store.service.js";

// 가게 추가 핸들러
export const handleCreateStore = async (req, res, next) => {
    /*
    #swagger.summary = '가게 추가 API';
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        name: { type: "string", example: "맛있는 식당" },
                        regionName: { type: "string", example: "강남구" },
                        address: { type: "string", example: "서울시 강남구 테헤란로 123" },
                        description: { type: "string", example: "맛있는 한식 전문점" },
                        status: { type: "string", example: "active" }
                    }
                }
            }
        }
    };
    #swagger.responses[201] = {
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
                                storeId: { type: "number" },
                                name: { type: "string" },
                                regionName: { type: "string" },
                                address: { type: "string" },
                                description: { type: "string" },
                                status: { type: "string" },
                                createdAt: { type: "string", format: "date-time" },
                                updatedAt: { type: "string", format: "date-time" }
                            }
                        }
                    }
                }
            }
        }
    };
    #swagger.responses[400] = {
        description: "가게 추가 실패 응답",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAIL" },
                        error: {
                            type: "object",
                            properties: {
                                errorCode: { type: "string", example: "S001" },
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
        console.log("가게 추가를 요청했습니다!");
        console.log("body:", req.body);

        const storeData = bodyToStore(req.body);
        const store = await createStore(storeData);

        res.status(StatusCodes.CREATED).success(store);
    } catch (err) {
        next(err);
    }
};