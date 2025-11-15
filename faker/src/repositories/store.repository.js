// src/repositories/store.repository.js (수정)

import { prisma } from "../db.config.js"; // prisma 객체만 남김

// 새로운 가게 데이터를 삽입 (addStore)
export const addStore = async (data) => {
  // const conn = await pool.getConnection(); // 제거
  
  try {
    const newStore = await prisma.store.create({
      data: {
        name: data.name,
        address: data.address,
        rating: data.rating,
        regionId: data.regionId,
      }
    });

    return newStore.id;
  } catch (err) {
    throw new Error(
      `가게 추가 중 오류가 발생했습니다. (${err.message})`
    );
  }
};

// 등록된 가게 정보 조회 (getStore)
export const getStore = async (storeId) => {
  try {
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    
    // 기존 함수가 배열을 기대했다면 return [store];
    return store; 
  } catch (err) {
    throw new Error(`가게 정보 조회 중 오류가 발생했습니다. (${err.message})`);
  }
};

// 가게 ID 존재 여부 확인 (isStoreExist)
export const isStoreExist = async (storeId) => {
  // const conn = await pool.getConnection(); // 제거
  try {
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    
    // 객체가 존재하면 true, null이면 false 반환
    return store !== null; 
  } catch (err) {
    throw new Error(`가게 존재 여부 확인 중 오류가 발생했습니다. (${err.message})`);
  }
};

export const getAllStoreReviews = async (storeId, cursor) => { 
  
  try {
    const reviews = await prisma.userStoreReview.findMany({ /* ... */ });
    return reviews;
  } catch (err) {
    throw new Error(`리뷰 조회 중 오류가 발생했어요. (${err.message})`);
  }
};