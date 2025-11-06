// src/services/store.service.js

import { addStore, getStore } from "../repositories/store.repository.js";
import { responseFromStore } from "../dtos/store.dto.js";

export const registerStore = async (data) => {
  // 1. Repository를 통해 가게 정보를 DB에 삽입하고 ID를 받음
  const storeId = await addStore(data);

  if (!storeId) {
    throw new Error("가게 등록에 실패했습니다.");
  }

  // 2. 등록된 가게 정보를 다시 조회
  const newStore = await getStore(storeId);
  
  if (!newStore) {
      throw new Error("등록된 가게 정보를 찾을 수 없습니다.");
  }

  // 3. DTO를 이용해 응답 형식으로 변환하여 반환
  return responseFromStore(newStore);
};