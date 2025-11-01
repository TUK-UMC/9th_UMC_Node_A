import { StatusCodes } from "http-status-codes";
import { bodyToMission } from "../dtos/mission.dto.js";
import { createMission, startMissionChallenge } from "../services/mission.service.js";

// 미션 추가 핸들러
export const handleCreateMission = async (req, res, next) => {
    try {
        console.log("미션 추가를 요청했습니다!");
        console.log("params:", req.params);
        console.log("body:", req.body);

        const storeId = parseInt(req.params.storeId);

        // body를 Mission DTO로 변환
        const missionData = bodyToMission(req.body, storeId);

        // 미션 생성
        const mission = await createMission(missionData);

        // 성공 응답
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "미션이 성공적으로 추가되었습니다.",
            result: mission,
        });
    } catch (err) {
        console.error("미션 추가 중 오류 발생:", err);
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: err.message,
        });
    }
};

// 미션 도전하기 핸들러
export const handleChallengeMission = async (req, res, next) => {
    try {
        console.log("미션 도전을 요청했습니다!");
        console.log("params:", req.params);
        console.log("body:", req.body);

        const missionId = parseInt(req.params.missionId);
        const userId = req.body.userId; // 실제로는 인증 미들웨어에서 가져와야 함

        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "userId는 필수입니다.",
            });
        }

        // 미션 도전 시작
        const mission = await startMissionChallenge(missionId, userId);

        // 성공 응답
        res.status(StatusCodes.OK).json({
            success: true,
            message: "미션 도전이 시작되었습니다.",
            result: mission,
        });
    } catch (err) {
        console.error("미션 도전 중 오류 발생:", err);
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: err.message,
        });
    }
};
