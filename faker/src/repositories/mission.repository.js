// src/repositories/mission.repository.js

import { pool } from "../db.config.js";

// Mission 저장
export const addMission = async ({ storeId, title, content }) => {
  const conn = await pool.getConnection();

  // 미션의 기본 상태(status)를 'ACTIVE'로 가정하고 저장
  const defaultStatus = 'ACTIVE'; 
  
  const query = `
    INSERT INTO mission (store_id, title, content, status) 
    VALUES (?, ?, ?, ?);
  `;
  
  try {
    const [result] = await pool.query(query, [
      storeId,
      title,
      content,
      defaultStatus,
    ]);

    return result.insertId;
  } catch (err) {
    throw new Error(
      `미션 저장 중 오류가 발생했습니다. (${err.message}). mission 테이블과 store 테이블의 외래키 제약을 확인해주세요.`
    );
  } finally {
    conn.release();
  }
};

// 등록된 Mission 정보 조회
export const getMission = async (missionId) => {
  const conn = await pool.getConnection();
  try {
    const [mission] = await pool.query(`SELECT * FROM mission WHERE id = ?;`, missionId);
    
    return mission.length > 0 ? mission[0] : null; 
  } catch (err) {
    throw new Error(`미션 정보 조회 중 오류가 발생했습니다. (${err.message})`);
  } finally {
    conn.release();
  }
};

// ⭐ 추가: 미션 ID 존재 여부 확인 (미션 4의 검증 로직을 위한 필수 함수)
export const isMissionExist = async (missionId) => {
  const conn = await pool.getConnection();
  try {
    const [confirm] = await pool.query(
      `SELECT EXISTS(SELECT 1 FROM mission WHERE id = ?) as isExist;`,
      missionId
    );
    // 쿼리 결과 isExist가 1이면 true, 0이면 false 반환
    return confirm[0].isExist === 1; 
  } catch (err) {
    throw new Error(`미션 존재 여부 확인 중 오류가 발생했습니다. (${err.message})`);
  } finally {
    conn.release();
  }
};