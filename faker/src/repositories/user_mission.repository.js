// src/repositories/user_mission.repository.js

import { pool } from "../db.config.js";

// 미션 도전 중복 여부 확인 (status='IN_PROGRESS'인 경우만 중복으로 간주)
export const isAlreadyChallenging = async (userId, missionId) => {
  const conn = await pool.getConnection();
  try {
    const [confirm] = await pool.query(
      `SELECT EXISTS(SELECT 1 FROM user_mission WHERE user_id = ? AND mission_id = ? AND status = 'IN_PROGRESS') as isExist;`,
      [userId, missionId]
    );
    return confirm[0].isExist === 1; 
  } catch (err) {
    throw new Error(`도전 중 미션 확인 중 오류가 발생했습니다. (${err.message})`);
  } finally {
    conn.release();
  }
};

// 유저의 미션 도전 정보 저장
export const addUserMission = async (userId, missionId) => {
  const conn = await pool.getConnection();
  
  const defaultStatus = 'IN_PROGRESS'; 
  
  const query = `
    INSERT INTO user_mission (user_id, mission_id, status) 
    VALUES (?, ?, ?);
  `;
  
  try {
    const [result] = await pool.query(query, [
      userId,
      missionId,
      defaultStatus,
    ]);

    return result.insertId;
  } catch (err) {
    throw new Error(
      `유저 미션 도전 정보 저장 중 오류가 발생했습니다. (${err.message}). 외래키 제약을 확인해주세요.`
    );
  } finally {
    conn.release();
  }
};

// 등록된 UserMission 정보 조회
export const getUserMission = async (userMissionId) => {
  const conn = await pool.getConnection();
  try {
    const [userMission] = await pool.query(`SELECT * FROM user_mission WHERE id = ?;`, userMissionId);
    
    return userMission.length > 0 ? userMission[0] : null; 
  } catch (err) {
    throw new Error(`유저 미션 정보 조회 중 오류가 발생했습니다. (${err.message})`);
  } finally {
    conn.release();
  }
};