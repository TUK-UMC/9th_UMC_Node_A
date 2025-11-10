import { StatusCodes } from "http-status-codes";
import missionService from "../services/mission.service.js";
import missionDto from "../dtos/mission.dto.js";
import { StoreNotFoundError, MissionNotFoundError, MissionAlreadyOngoingError, MissionAlreadyCompletedError } from "../error.js";


class missionController {

    // 미션 추가 API - 컨트롤러
    async handleMissionAdd(req, res, next) {
        try {
            console.log("미션 추가를 요청합니다.");
            console.log("body: ", req.body);

            const mission = await missionService.missionAdd(missionDto.bodyToMission(req.body));
            res.status(StatusCodes.OK).json({ result: mission });
        } catch (error) {
            // 커스텀 에러인 경우 그대로 전달, 아니면 기본 에러 형식으로 변환
            if (error instanceof StoreNotFoundError) {
                const customError = {
                    statusCode: StatusCodes.BAD_REQUEST,
                    errorCode: error.errorCode,
                    reason: error.reason,
                    data: error.data
                };
                next(customError);
            } else {
                // 일반 에러인 경우
                const customError = {
                    statusCode: StatusCodes.BAD_REQUEST,
                    errorCode: "MISSION_ADD_ERROR",
                    reason: error.message || "미션 추가 중 오류가 발생했습니다.",
                    data: null
                };
                next(customError);
            }
        }
    };

    // 유저가 도전중인 미션에 추가 API - 컨트롤러
    async hanldeUserMissionAdd(req, res, next) {
        try {
            console.log("유저 미션 추가를 요청합니다.");
            console.log("body: ", req.body);

            const userMission = await missionService.userMissionAdd(missionDto.bodyToUserMission(req.body));
            res.status(StatusCodes.OK).json({ result: userMission });
        } catch (error) {
            // 커스텀 에러인 경우 그대로 전달, 아니면 기본 에러 형식으로 변환
            if (error instanceof MissionNotFoundError || 
                error instanceof MissionAlreadyOngoingError || 
                error instanceof MissionAlreadyCompletedError) {
                const customError = {
                    statusCode: StatusCodes.BAD_REQUEST,
                    errorCode: error.errorCode,
                    reason: error.reason,
                    data: error.data
                };
                next(customError);
            } else {
                // 일반 에러인 경우
                const customError = {
                    statusCode: StatusCodes.BAD_REQUEST,
                    errorCode: "USER_MISSION_ADD_ERROR",
                    reason: error.message || "유저 미션 추가 중 오류가 발생했습니다.",
                    data: null
                };
                next(customError);
            }
        }
    }
}

export default new missionController();