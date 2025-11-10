// src/controllers/mission.controller.js

import { StatusCodes } from "http-status-codes";
import { bodyToMission } from "../dtos/mission.dto.js";
import { registerMission } from "../services/mission.service.js";

import { listStoreMissions } from "../services/mission.service.js"; // 새 Service 함수

// 미션 등록 핸들러
export const handleMissionRegister = async (req, res, next) => {
  try {
    // 1. Path Parameter에서 storeId 획득 (숫자형으로 변환)
    const storeId = parseInt(req.params.storeId, 10);
    
    console.log(`가게 ID ${storeId}에 미션 등록을 요청했습니다!`);
    
    // 2. DTO를 이용해 요청 본문을 Service용 객체로 변환
    const missionData = bodyToMission(req.body);

    // 3. Service 호출 및 등록된 미션 정보 받기
    const mission = await registerMission(storeId, missionData); 
    
    res.status(StatusCodes.CREATED).json({ 
        message: "미션이 성공적으로 등록되었습니다.",
        result: mission
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
 * GET /api/v1/stores/:storeId/missions 요청을 처리합니다.
 */
export const handleListStoreMissions = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    
    const missions = await listStoreMissions(storeId);
    
    res.status(StatusCodes.OK).json({
        message: `${storeId}번 가게의 미션 목록 조회 성공`,
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