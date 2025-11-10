// src/controllers/user_mission.controller.js

import { StatusCodes } from "http-status-codes";
import { challengeMission, listChallengingMissions } from "../services/user_mission.service.js"; // 새 Service 함수 import

// 미션 도전 핸들러
export const handleMissionChallenge = async (req, res, next) => {
  try {
    // 1. Path Parameter에서 missionId 획득 (숫자형으로 변환)
    const missionId = parseInt(req.params.missionId, 10);
    
    console.log(`미션 ID ${missionId} 도전을 요청했습니다!`);
    
    // 2. Service 호출 및 미션 도전 정보 받기
    const userMission = await challengeMission(missionId); 
    
    res.status(StatusCodes.CREATED).json({ 
        message: "미션 도전을 시작합니다.",
        result: userMission
    });

  } catch (error) {
    // 에러 핸들링
    res.status(StatusCodes.BAD_REQUEST).json({ 
        isSuccess: false,
        code: StatusCodes.BAD_REQUEST,
        message: error.message 
    });
  }
};

/**
 * GET /api/v1/users/:userId/missions 요청을 처리합니다.
 */
export const handleListChallengingMissions = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    
    const missions = await listChallengingMissions(userId);
    
    res.status(StatusCodes.OK).json({
        message: `${userId}번 사용자의 도전 중인 미션 목록 조회 성공`,
        data: missions
    });

  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ 
        isSuccess: false,
        code: StatusCodes.BAD_REQUEST,
        message: error.message 
    });
  }
};