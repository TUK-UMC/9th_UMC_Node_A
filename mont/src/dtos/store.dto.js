import { serializeBigIntDeep } from "../utils/serialize.js";    // bigint 변환 유틸 임포트

class storeDto{

    // 가게 추가 요청 바디를 스토어 객체로 변환
    bodyToStore(body) {
        const now = new Date();
        return {
            regionId: body.regionId,
            storename: body.storename,
            address: body.address,
            score: body.score,
            created_at : now,
            updated_at : now,
        };
    };

    // 스토어 객체를 응답 형식에 맞게 변환 
    responseFromStore(store) {
        return {
            regionId: store.regionId,
            storename: store.storename,
            address: store.address,
            score: store.score,
            created_at : store.created_at,
            updated_at : store.updated_at,
        };
    };

    // 여러 리뷰 객체를 응답 형식에 맞게 변환
    responseFromReviews(reviews) {
    // BigInt 변환을 응답 생성 시점에 수행
    const serializedReviews = serializeBigIntDeep(reviews);
    return {
      data: serializedReviews, // 변환된 데이터 반환
      pagination: {
        cursor: serializedReviews.length
          ? serializedReviews[serializedReviews.length - 1].id
          : null,
      },
    };
  }
}


export default new storeDto();