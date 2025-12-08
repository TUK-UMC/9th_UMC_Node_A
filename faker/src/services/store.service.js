// src/services/store.service.js

import { responseFromStore, previewReviewResponseDTO } from "../dtos/store.dto.js"; 
import { addStore, getStore, getAllStoreReviews } from "../repositories/store.repository.js";

import { ResourceNotFoundError, InvalidInputError } from "../errors.js"; 

export const listStoreReviews = async (storeId, cursor) => {
  
  // 1. Repository 호출 (cursor 인자 전달)
  const reviews = await getAllStoreReviews(storeId, cursor); 
  
  // 2. 다음 커서 값 계산 로직 적용
  // take 개수와 리뷰 개수가 같으면, 다음 커서를 설정합니다.
  const nextCursor = (reviews.length === 5) 
      ? reviews[reviews.length - 1].id 
      : null; 
  
  // 3. DTO를 통해 응답 형식으로 가공 및 반환 (reviews와 nextCursor 전달)
  return previewReviewResponseDTO({ 
      reviews: reviews, 
      cursor: nextCursor 
  }); 
};


export const registerStore = async (data) => {
  
  // 1. Repository를 통해 가게 정보를 DB에 삽입하고 ID를 받음
  const storeId = await addStore(data);

  if (!storeId) {
    throw new InvalidInputError("가게 등록에 필요한 필수 정보가 누락되었거나 형식이 올바르지 않습니다.");
  }

  // 2. 등록된 가게 정보를 다시 조회
  const newStore = await getStore(storeId);
  
  if (!newStore) {
      throw new ResourceNotFoundError("등록된 가게", { storeId });
  }

  // 3. DTO를 이용해 응답 형식으로 변환하여 반환
  return responseFromStore(newStore);
};