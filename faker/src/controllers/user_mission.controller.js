// src/controllers/user_mission.controller.js

import { StatusCodes } from "http-status-codes";
import { challengeMission } from "../services/user_mission.service.js";

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