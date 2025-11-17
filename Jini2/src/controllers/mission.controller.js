import { StatusCodes } from "http-status-codes";
import { bodyToMission } from "../dtos/mission.dto.js";
import { createMission, startMissionChallenge } from "../services/mission.service.js";
import { BadRequestError } from "../errors.js";

// 미션 추가 핸들러
export const handleCreateMission = async (req, res, next) => {
    /*
    #swagger.summary = '가게 미션 추가 API';
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
                        rewardPoint: { type: "number", example: 1000 },
                        title: { type: "string", example: "리뷰 3개 작성하기" },
                        description: { type: "string", example: "가게에 대한 리뷰를 3개 이상 작성하면 마일리지를 지급합니다." },
                        bossCode: { type: "string", example: "BOSS2024" }
                    }
                }
            }
        }
    };
    #swagger.responses[201] = {
        description: "미션 추가 성공 응답",
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
                                missionId: { type: "number" },
                                storeId: { type: "number" },
                                rewardPoint: { type: "number" },
                                title: { type: "string" },
                                description: { type: "string" },
                                bossCode: { type: "string" },
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
        description: "미션 추가 실패 응답",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAIL" },
                        error: {
                            type: "object",
                            properties: {
                                errorCode: { type: "string", example: "M001" },
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
        console.log("미션 추가를 요청했습니다!");
        console.log("params:", req.params);
        console.log("body:", req.body);

        const storeId = parseInt(req.params.storeId);
        const missionData = bodyToMission(req.body, storeId);
        const mission = await createMission(missionData);

        res.status(StatusCodes.CREATED).success(mission);
    } catch (err) {
        next(err);
    }
};

// 미션 도전하기 핸들러
export const handleChallengeMission = async (req, res, next) => {
    /*
    #swagger.summary = '미션 도전하기 API';
    #swagger.parameters['missionId'] = {
        in: 'path',
        description: '미션 ID',
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
                        userId: { type: "number", example: 1 }
                    }
                }
            }
        }
    };
    #swagger.responses[200] = {
        description: "미션 도전 성공 응답",
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
                                userMissionId: { type: "number" },
                                missionId: { type: "number" },
                                storeId: { type: "number" },
                                userId: { type: "number" },
                                rewardPoint: { type: "number" },
                                title: { type: "string" },
                                description: { type: "string" },
                                bossCode: { type: "string" },
                                status: { type: "string", example: "ongoing" },
                                challengedAt: { type: "string", format: "date-time" },
                                completedAt: { type: "string", format: "date-time", nullable: true }
                            }
                        }
                    }
                }
            }
        }
    };
    #swagger.responses[400] = {
        description: "미션 도전 실패 응답",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAIL" },
                        error: {
                            type: "object",
                            properties: {
                                errorCode: { type: "string", example: "M002" },
                                reason: { type: "string", example: "이미 도전 중인 미션입니다." },
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
        console.log("미션 도전을 요청했습니다!");
        console.log("params:", req.params);
        console.log("body:", req.body);

        const missionId = parseInt(req.params.missionId);
        const userId = req.body.userId;

        if (!userId) {
            throw new BadRequestError("userId는 필수입니다.", req.body);
        }

        const mission = await startMissionChallenge(missionId, userId);

        res.status(StatusCodes.OK).success(mission);
    } catch (err) {
        next(err);
    }
};