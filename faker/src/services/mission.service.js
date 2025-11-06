// src/services/mission.service.js

import { isStoreExist } from "../repositories/store.repository.js"; // Store Repository 함수 재사용
import { addMission, getMission } from "../repositories/mission.repository.js";
import { responseFromMission } from "../dtos/mission.dto.js";

// 미션 등록 서비스
export const registerMission = async (storeId, data) => {
  // 1. 가게 존재 여부 검증 
  const exists = await isStoreExist(storeId);
  if (!exists) {
    throw new Error(`ID ${storeId}인 가게는 존재하지 않아 미션을 등록할 수 없습니다.`);
  }

  // 2. Repository를 통해 미션 정보 DB에 삽입하고 ID를 받음
  const missionId = await addMission({
    storeId: storeId, // Path Parameter로 받은 ID 사용
    title: data.title,
    content: data.content,
  });

  if (!missionId) {
    throw new Error("미션 등록에 실패했습니다.");
  }

  // 3. 등록된 미션 정보 조회
  const newMission = await getMission(missionId);

  // 4. DTO를 이용해 응답 형식으로 변환하여 반환
  return responseFromMission(newMission);
};