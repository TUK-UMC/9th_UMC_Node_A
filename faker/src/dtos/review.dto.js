// src/dtos/review.dto.js

// 리뷰 요청 Body를 Service로 전달할 객체로 변환
export const bodyToReview = (body) => {
  return {
    rating: body.rating,
    content: body.content || null, // 내용 생략 가능
  };
};

// Service에서 받은 DB 결과를 클라이언트 응답 형식으로 변환
export const responseFromReview = (review) => {
  return {
    reviewId: review.id,
    userId: review.user_id, // 리뷰 작성자 ID
    storeId: review.store_id, // 리뷰 대상 가게 ID
    rating: review.rating,
    content: review.content,
    createdAt: review.created_at,
  };
};