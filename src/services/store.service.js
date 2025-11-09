import storeRepo from "../repositories/store.repository.js";
import storeDto from "../dtos/store.dto.js";

class storeService {
  async storeAdd(data) {
    
    // 1. storename으로 DB에 이미 존재하는 가게 조회
    const existingStore = await storeRepo.findStoreByName(data.storename);

    if (existingStore) {
      throw new Error("이미 존재하는 가게입니다.");
    }

    // 2. 중복 없으면 가게 추가
    await storeRepo.putStore({
      regionId: data.regionId,
      storename: data.storename,
      address: data.address,
      score: data.score,
      created_at: data.created_at,
      updated_at: data.updated_at,
    });

    // 3. 추가한 데이터 응답 DTO 변환 후 반환
    return storeDto.responseFromStore(data);
  }

  // 가게 리뷰 목록 조회 API - 서비스
  async listStoreReviews(storeId, cursor) {
  const reviews = await storeRepo.getAllStoreReviews(storeId, cursor);
  return storeDto.responseFromReviews(reviews);
};
}

export default new storeService();
