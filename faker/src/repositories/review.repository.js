// src/repositories/review.repository.js

import { pool } from "../db.config.js";

// 리뷰 저장
export const addReview = async ({ userId, storeId, rating, content }) => {
  const conn = await pool.getConnection();

  const query = `
    INSERT INTO review (user_id, store_id, rating, content) 
    VALUES (?, ?, ?, ?);
  `;
  
  try {
    const [result] = await pool.query(query, [
      userId,
      storeId,
      rating,
      content,
    ]);

    return result.insertId;
  } catch (err) {
    throw new Error(
      `리뷰 저장 중 오류가 발생했습니다. (${err.message})`
    );
  } finally {
    conn.release();
  }
};

// 등록된 리뷰 정보 조회
export const getReview = async (reviewId) => {
  const conn = await pool.getConnection();
  try {
    const [review] = await pool.query(`SELECT * FROM review WHERE id = ?;`, reviewId);
    
    return review.length > 0 ? review[0] : null; 
  } catch (err) {
    throw new Error(`리뷰 정보 조회 중 오류가 발생했습니다. (${err.message})`);
  } finally {
    conn.release();
  }
};