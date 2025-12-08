// src/controllers/mission.controller.js

import { StatusCodes } from "http-status-codes";
import { bodyToMission } from "../dtos/mission.dto.js";
import { registerMission } from "../services/mission.service.js";

import { listStoreMissions } from "../services/mission.service.js"; // 새 Service 함수

export const handleMissionRegister = async (req, res, next) => {
/*
#swagger.summary = '미션 등록 API';
#swagger.description = '특정 가게에 새로운 미션을 등록합니다.';
#swagger.parameters['storeId'] = {
  in: 'path',
  description: '미션을 등록할 가게 ID',
  required: true,
  type: 'number'
}
#swagger.requestBody = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          title: { type: "string", example: "시그니처 메뉴 인증" },
          content: { type: "string", example: "주문하고 사진 찍어 인증" }
        }
      }
    }
  }
}
#swagger.responses[201] = {
  description: "미션 등록 성공 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "SUCCESS" },
          success: { $ref: "#/definitions/MissionResponse" } // Mission DTO 참조
        }
      }
    }
  }
}
#swagger.responses[404] = {
  description: "가게 ID를 찾을 수 없는 경우",
  content: {
    "application/json": {
      schema: { $ref: "#/definitions/ResourceNotFoundError" } 
    }
  }
}
*/
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


// GET /api/v1/stores/:storeId/missions 요청 처리
 
export const handleListStoreMissions = async (req, res, next) => {
/*
#swagger.summary = '가게 미션 목록 조회 API';
#swagger.description = '특정 가게에 등록된 모든 미션 목록을 조회합니다.';
#swagger.parameters['storeId'] = {
  in: 'path',
  description: '미션을 조회할 가게 ID',
  required: true,
  type: 'number'
}
#swagger.responses[200] = {
  description: "미션 목록 조회 성공 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "SUCCESS" },
          success: { 
            type: "array",
            items: { $ref: "#/definitions/MissionResponse" }
          }
        }
      }
    }
  }
}
#swagger.responses[404] = {
  description: "가게 ID를 찾을 수 없는 경우",
  content: {
    "application/json": {
      schema: { $ref: "#/definitions/ResourceNotFoundError" } 
    }
  }
}
*/
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