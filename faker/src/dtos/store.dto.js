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