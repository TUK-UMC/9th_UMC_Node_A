// src/repositories/store.repository.js

import { pool } from "../db.config.js";

import { prisma } from "../db.config.js";

// 새로운 가게 데이터를 삽입 (미션 1)
export const addStore = async (data) => {
  const conn = await pool.getConnection();

  // 주의: 실제 DB 스키마에 맞게 필드명을 수정해야 합니다. 
  // 여기서는 store 테이블이 name, address, rating, region_id를 가진다고 가정합니다.
  const query = `
    INSERT INTO store (name, address, rating, region_id) 
    VALUES (?, ?, ?, ?);
  `;
  
  try {
    const [result] = await pool.query(query, [
      data.name,
      data.address,
      data.rating,
      data.regionId, 
    ]);

    // 삽입된 가게의 Primary Key (ID) 반환
    return result.insertId;
  } catch (err) {
    throw new Error(
      `가게 추가 중 오류가 발생했습니다. (${err.message})`
    );
  } finally {
    conn.release();
  }
};

// 등록된 가게 정보 조회 (미션 1)
export const getStore = async (storeId) => {
  const conn = await pool.getConnection();
  try {
    const [store] = await pool.query(`SELECT * FROM store WHERE id = ?;`, storeId);
    
    // 단일 가게 객체 반환
    return store.length > 0 ? store[0] : null; 
  } catch (err) {
    throw new Error(`가게 정보 조회 중 오류가 발생했습니다. (${err.message})`);
  } finally {
    conn.release();
  }
};

// 가게 ID 존재 여부 확인 (미션 2 - 리뷰 등록을 위한 검증 로직)
export const isStoreExist = async (storeId) => {
  const conn = await pool.getConnection();
  try {
    const [confirm] = await pool.query(
      `SELECT EXISTS(SELECT 1 FROM store WHERE id = ?) as isExist;`,
      storeId
    );
    // 쿼리 결과 isExist가 1이면 true, 0이면 false 반환
    return confirm[0].isExist === 1; 
  } catch (err) {
    throw new Error(`가게 존재 여부 확인 중 오류가 발생했습니다. (${err.message})`);
  } finally {
    conn.release();
  }
};

// ⭐ Repository 함수: 특정 가게의 리뷰 목록 조회 (페이지네이션 적용)
export const getAllStoreReviews = async (storeId, cursor) => { // cursor 인자 추가

  const reviews = await prisma.userStoreReview.findMany({
    select: {
      id: true, 
      content: true, 
      storeId: true, 
      userId: true, 
      store: true, 
      user: true, 
    },
    where: { 
      storeId: storeId, 
      // ⭐ [핵심] cursor 값이 0보다 크면 id > cursor 조건 적용
      id: { gt: cursor } 
    },
    orderBy: { id: "asc" }, // ID 기준 오름차순 정렬
    take: 5, // ⭐ [핵심] 한 번에 5개 항목만 조회
  });
  
  return reviews;
};