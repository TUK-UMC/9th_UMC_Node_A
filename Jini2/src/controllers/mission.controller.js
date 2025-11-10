import { StatusCodes } from "http-status-codes";
import { bodyToMission } from "../dtos/mission.dto.js";
import { createMission, startMissionChallenge } from "../services/mission.service.js";
import { BadRequestError } from "../errors.js";

// 미션 추가 핸들러
export const handleCreateMission = async (req, res, next) => {
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
