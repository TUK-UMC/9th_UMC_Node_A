// src/controllers/user_mission.controller.js

import { StatusCodes } from "http-status-codes";
import { challengeMission, listChallengingMissions } from "../services/user_mission.service.js"; // 새 Service 함수 import

export const handleMissionChallenge = async (req, res, next) => {
/*
#swagger.summary = '미션 도전 API';
#swagger.description = '특정 미션에 도전을 시작합니다. (사용자 ID는 Service에서 가정)';
#swagger.parameters['missionId'] = {
  in: 'path',
  description: '도전할 미션 ID',
  required: true,
  type: 'number'
}
#swagger.responses[201] = {
  description: "미션 도전 성공 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "SUCCESS" },
          success: { $ref: "#/definitions/UserMissionResponse" } // 도전 정보 (예: id, status, createdAt)
        }
      }
    }
  }
}
#swagger.responses[404] = {
  description: "미션 ID를 찾을 수 없는 경우",
  content: {
    "application/json": {
      schema: { $ref: "#/definitions/ResourceNotFoundError" }
    }
  }
}
#swagger.responses[409] = {
  description: "이미 도전 중인 미션인 경우",
  content: {
    "application/json": {
      schema: { $ref: "#/definitions/AlreadyChallengingError" }
    }
  }
}
*/
  try {
    // 1. Path Parameter에서 missionId 획득 (숫자형으로 변환)
    const missionId = parseInt(req.params.missionId, 10);
    const userId = req.user.id;

    // 2. Service 호출 및 미션 도전 정보 받기
    const userMission = await challengeMission(userId,missionId); 
    
    res.status(StatusCodes.CREATED).json({ 
        message: "미션 도전을 시작합니다.",
        result: userMission
    });

  } catch (error) {
    // 에러 핸들링
    next(error);
  }
};

export const handleListChallengingMissions = async (req, res, next) => {
/*
#swagger.summary = '사용자 도전 중인 미션 목록 조회';
#swagger.description = '특정 사용자가 현재 도전 중인 미션 목록을 조회합니다.';
#swagger.parameters['userId'] = {
  in: 'path',
  description: '조회할 사용자 ID',
  required: true,
  type: 'number'
}
#swagger.responses[200] = {
  description: "도전 중인 미션 목록 조회 성공 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "SUCCESS" },
          success: { 
            type: "array",
            items: { $ref: "#/definitions/ChallengingMissionItem" } // 도전 미션 아이템 목록 참조
          }
        }
      }
    }
  }
}
#swagger.responses[404] = {
  description: "사용자 ID를 찾을 수 없는 경우",
  content: {
    "application/json": {
      schema: { $ref: "#/definitions/ResourceNotFoundError" }
    }
  }
}
*/
  try {
    // 인증 미들웨어를 통과한 유저의 ID를 사용
    const userId = req.user.id;
    
    const missions = await listChallengingMissions(userId);
    
    res.status(StatusCodes.OK).success(missions);

  } catch (error) {
    next(error);
  }
};