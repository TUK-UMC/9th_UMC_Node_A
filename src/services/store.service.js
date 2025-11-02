import storeRepository from "../repositories/store.repository.js";
import storeDto from "../dtos/store.dto.js";

class storeService {
  async storeAdd(data) {
    // 1. storename으로 DB에 이미 존재하는 가게 조회
    const existingStore = await storeRepository.findStoreByName(data.storename);

    if (existingStore) {
      throw new Error("이미 존재하는 가게입니다.");
    }

    // 2. 중복 없으면 가게 추가
    const joinStoreId = await storeRepository.putStore({
      region_id: data.region_id,
      storename: data.storename,
      address: data.address,
      score: data.score,
    });

    // 3. 추가한 데이터 응답 DTO 변환 후 반환
    return storeDto.responseFromStore(data);
  }
}

export default new storeService();
