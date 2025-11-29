// src/services/user_mission.service.js

import { isMissionExist } from "../repositories/mission.repository.js"; 
import { 
    isAlreadyChallenging, 
    addUserMission, 
    getUserMission,
    getChallengingMissions
} from "../repositories/user_mission.repository.js";
import { responseFromUserMission, responseFromUserMissionsList } from "../dtos/user_mission.dto.js";

import { ResourceNotFoundError, AlreadyChallengingError, InvalidInputError } from "../errors.js";


/*
 * 특정 사용자 ID로 도전 중인 미션 목록을 조회하는 Service 함수입니다.
 * (이 함수는 에러를 throw할 부분이 없으므로, 커스텀 에러 import만 확인합니다.)
 */
export const listChallengingMissions = async (userId) => {
    // 1. Repository 호출
    const missions = await getChallengingMissions(userId);
    
    // 2. DTO를 통해 응답 형식으로 가공
    return responseFromUserMissionsList(missions);
};


// 미션 도전 서비스
export const challengeMission = async (userId,missionId) => {

  // 1. 미션이 유효한지 검증
  const missionExists = await isMissionExist(missionId);
  if (!missionExists) {
    throw new ResourceNotFoundError("미션", { missionId }); 
  }

  // 2. 도전 중복 여부 검증 (핵심 로직)
  const isChallenging = await isAlreadyChallenging(userId, missionId);
  if (isChallenging) {
    throw new AlreadyChallengingError(`이미 ID ${missionId}인 미션을 도전 중입니다.`, { userId, missionId });
  }
  
  // 3. 유저 미션 도전 정보 DB에 삽입 (상태: IN_PROGRESS)
  const userMissionId = await addUserMission(userId, missionId);

  if (!userMissionId) {
    throw new InvalidInputError("미션 도전 정보 저장에 실패했습니다.", { userId, missionId });
  }

  // 4. 등록된 UserMission 정보 조회 후 DTO 변환 및 반환
  const newUserMission = await getUserMission(userMissionId);

  return responseFromUserMission(newUserMission);
};