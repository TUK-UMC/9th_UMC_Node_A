// src/dtos/store.dto.js

// Postman 요청 Body를 Service로 전달할 객체로 변환
export const bodyToStore = (body) => {
  return {
    name: body.name,
    address: body.address,
    rating: body.rating,
    regionId: body.regionId, // 필수: 가게가 속할 지역 ID
  };
};

// Service에서 받은 DB 결과를 클라이언트 응답 형식에 맞게 변환
export const responseFromStore = (store) => {
  return {
    storeId: store.id,
    name: store.name,
    address: store.address,
    rating: store.rating,
    regionId: store.region_id, // DB 필드명 'region_id'를 그대로 사용
    createdAt: store.created_at,
  };
};

/*
 * 리뷰 목록 조회 결과를 클라이언트 응답 형식에 맞게 변환
 * (pagination과 data 필드를 분리하여 반환)
 */
export const previewReviewResponseDTO = (data) => {
  const processedReviews = data.reviews.map(review => ({
      // UserStoreReview 필드
      reviewId: review.id,
      content: review.content,
      
      // User 정보 평탄화
      userId: review.userId,
      userName: review.user ? review.user.name : null, // user 객체가 있다면 name 추출
      
      // Store 정보 평탄화
      storeId: review.storeId,
  }));
  
  return {
    data: processedReviews, // 가공된 리뷰 목록
    
    pagination: {
        // 다음 요청에 사용할 cursor ID 반환
        cursor: data.cursor || null,
    },
  };
};