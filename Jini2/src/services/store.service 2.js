import { addStore, getStore } from "../repositories/store.repository.js";
import { storeToResponse } from "../dtos/store.dto.js";

// 가게 추가
export const createStore = async (data) => {
    // 가게 추가
    const storeId = await addStore(data);

    // 추가된 가게 정보 조회
    const store = await getStore(storeId);

    // 응답 DTO로 변환하여 반환
    return storeToResponse(store);
};
