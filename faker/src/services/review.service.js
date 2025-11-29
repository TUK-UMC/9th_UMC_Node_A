// src/services/review.service.js

import { isStoreExist } from "../repositories/store.repository.js"; // Store Repository에서 검증 함수 import
import { addReview, getReview } from "../repositories/review.repository.js";
import { responseFromReview } from "../dtos/review.dto.js";

// 리뷰 등록 서비스
export const registerReview = async (userId,storeId, data) => {
  // 1. 가게 존재 여부 검증 (핵심 로직)
  const exists = await isStoreExist(storeId);
  if (!exists) {
    throw new Error(`ID ${storeId}인 가게는 존재하지 않아 리뷰를 작성할 수 없습니다.`);
  }

  // 2. 리뷰 정보 DB 저장 (파라미터로 받은 userId 사용)
  const reviewId = await addReview({
    userId: userId, // 외부에서 받은 userId 사용
    storeId: storeId, 
    rating: data.rating,
    content: data.content,
  });

  if (!reviewId) {
    throw new Error("리뷰 등록에 실패했습니다.");
  }

  // 4. 등록된 리뷰 정보 조회
  const newReview = await getReview(reviewId);

  // 5. DTO를 이용해 응답 형식으로 변환하여 반환
  return responseFromReview(newReview);
};