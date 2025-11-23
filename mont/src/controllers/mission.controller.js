import { StatusCodes } from "http-status-codes";
import missionService from "../services/mission.service.js";
import missionDto from "../dtos/mission.dto.js";
import { StoreNotFoundError, MissionNotFoundError, MissionAlreadyOngoingError, MissionAlreadyCompletedError } from "../error.js";
import errorHandler from "../utils/error.handler.js";


class missionController {

    // 미션 추가 API - 컨트롤러
    async handleMissionAdd(req, res, next) {
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
        try {
            console.log("유저 미션 추가를 요청합니다.");
            console.log("body: ", req.body);
            console.log("user: ", req.user);
            
            // 인증된 사용자의 ID를 사용
            const userMissionData = {
                ...req.body,
                userId: req.user.id
            };

            const userMission = await missionService.userMissionAdd(missionDto.bodyToUserMission(userMissionData));
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