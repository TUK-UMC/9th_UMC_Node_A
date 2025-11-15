// src/repositories/review.repository.js

// 기존 import { pool } from "../db.config.js"; 를 제거하고
import { prisma } from "../db.config.js"; 

// 리뷰 저장 (addReview)
export const addReview = async ({ userId, storeId, rating, content }) => {
  // const conn = await pool.getConnection(); // 제거

  try {
    const newReview = await prisma.userStoreReview.create({
      data: {
        userId: userId,
        storeId: storeId,
        rating: rating,
        content: content,
      }
    });

    return newReview.id;
  } catch (err) {
    throw new Error(
      `리뷰 저장 중 오류가 발생했습니다. (${err.message})`
    );
  }
  // finally { conn.release(); } // 제거
};

// 등록된 리뷰 정보 조회 (getReview)
export const getReview = async (reviewId) => {
  // const conn = await pool.getConnection(); // 제거
  try {
    // findUnique는 Primary Key로 조회
    const review = await prisma.userStoreReview.findUnique({ where: { id: reviewId } });
    
    return review; // 단일 객체 또는 null 반환
  } catch (err) {
    throw new Error(`리뷰 정보 조회 중 오류가 발생했습니다. (${err.message})`);
  }
  // finally { conn.release(); } // 제거
};