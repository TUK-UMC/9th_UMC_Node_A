import { StatusCodes } from "http-status-codes";
import missionService from "../services/mission.service.js";
import missionDto from "../dtos/mission.dto.js";
import { StoreNotFoundError, MissionNotFoundError, MissionAlreadyOngoingError, MissionAlreadyCompletedError } from "../error.js";
import errorHandler from "../utils/error.handler.js";


class missionController {

    // 미션 추가 API - 컨트롤러
    async handleMissionAdd(req, res, next) {
      /*
    #swagger.summary = '미션 추가 API';
    #swagger.tags = ['Missions'];
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["storeId", "title", "description", "reward"],
            properties: {
              storeId: { type: "number", example: 1 },
              title: { type: "string", example: "방문 후 인증샷 올리기" },
              description: { type: "string", example: "가게 방문 후 인증샷을 올려주세요" },
              reward: { type: "number", example: 100 }
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
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
                  result: {
                    type: "object",
                    properties: {
                      id: { type: "number", example: 1 },
                      storeId: { type: "number", example: 1 },
                      title: { type: "string", example: "방문 후 인증샷 올리기" },
                      description: { type: "string", example: "가게 방문 후 인증샷을 올려주세요" },
                      reward: { type: "number", example: 100 },
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
      description: "미션 추가 실패 응답 - 가게 없음",
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
            console.log("미션 추가를 요청합니다.");
            console.log("body: ", req.body);

            const mission = await missionService.missionAdd(missionDto.bodyToMission(req.body));
            res.status(StatusCodes.OK).success({ result: mission });
        } catch (error) {
            const customError = errorHandler.handle(
                error,
                [StoreNotFoundError],
                "MISSION_ADD_ERROR",
                "미션 추가 중 오류가 발생했습니다."
            );
            next(customError);
        }
    };

    // 유저가 도전중인 미션에 추가 API - 컨트롤러
    async hanldeUserMissionAdd(req, res, next) {
      /*
    #swagger.summary = '유저 미션 추가 API';
    #swagger.tags = ['Missions'];
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["userId", "missionId"],
            properties: {
              userId: { type: "number", example: 1 },
              missionId: { type: "number", example: 1 }
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "유저 미션 추가 성공 응답",
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
                      userId: { type: "number", example: 1 },
                      missionId: { type: "number", example: 1 },
                      status: { type: "string", example: "ONGOING" },
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
      description: "유저 미션 추가 실패 응답 - 미션 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "MISSION_NOT_FOUND" },
                  reason: { type: "string", example: "존재하지 않는 미션입니다." },
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
            console.log("유저 미션 추가를 요청합니다.");
            console.log("body: ", req.body);

            const userMission = await missionService.userMissionAdd(missionDto.bodyToUserMission(req.body));
            res.status(StatusCodes.OK).success({ result: userMission });
        } catch (error) {
            const customError = errorHandler.handle(
                error,
                [MissionNotFoundError, MissionAlreadyOngoingError, MissionAlreadyCompletedError],
                "USER_MISSION_ADD_ERROR",
                "유저 미션 추가 중 오류가 발생했습니다."
            );
            next(customError);
        }
    }
}

export default new missionController();