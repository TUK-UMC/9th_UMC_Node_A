// src/services/user_mission.service.js

import { isMissionExist } from "../repositories/mission.repository.js"; // 미션 존재 여부 검증
import { 
    isAlreadyChallenging, // ⭐ 중복 검증 함수
    addUserMission, 
    getUserMission 
} from "../repositories/user_mission.repository.js";
import { responseFromUserMission } from "../dtos/user_mission.dto.js";

import { getChallengingMissions } from "../repositories/user_mission.repository.js"; 
import { responseFromUserMissionsList } from "../dtos/user_mission.dto.js"; // DTO 함수 import

/**
 * 특정 사용자 ID로 도전 중인 미션 목록을 조회하는 Service 함수입니다.
 * @param {number} userId - 사용자 ID
 * @returns {Array} 가공된 미션 목록 데이터
 */
export const listChallengingMissions = async (userId) => {
    // 1. Repository 호출
    const missions = await getChallengingMissions(userId);
    
    // 2. DTO를 통해 응답 형식으로 가공
    return responseFromUserMissionsList(missions);
};

// 미션 도전 서비스
export const challengeMission = async (missionId) => {
  // ⭐ 가정: 미션을 도전하는 사용자 ID는 1번 (혹은 실제 존재하는 ID)
  const assumedUserId = 3; 
  const userId = assumedUserId;

  // 1. 미션이 유효한지 검증
  const missionExists = await isMissionExist(missionId);
  if (!missionExists) {
    throw new Error(`ID ${missionId}인 미션은 존재하지 않아 도전할 수 없습니다.`);
  }

  // 2. 도전 중복 여부 검증 (핵심 로직)
  const isChallenging = await isAlreadyChallenging(userId, missionId);
  if (isChallenging) {
    throw new Error(`이미 ID ${missionId}인 미션을 도전 중입니다.`);
  }
  
  // 3. 유저 미션 도전 정보 DB에 삽입 (상태: IN_PROGRESS)
  const userMissionId = await addUserMission(userId, missionId);

  if (!userMissionId) {
    throw new Error("미션 도전 정보 저장에 실패했습니다.");
  }

  // 4. 등록된 UserMission 정보 조회 후 DTO 변환 및 반환
  const newUserMission = await getUserMission(userMissionId);

  return responseFromUserMission(newUserMission);
};