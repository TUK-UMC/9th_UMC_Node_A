// src/repositories/mission.repository.js

// 기존 import { pool } from "../db.config.js"; 를 제거하고
import { prisma } from "../db.config.js"; 

// Mission 저장 (addMission)
export const addMission = async ({ storeId, title, content }) => {
  // const conn = await pool.getConnection(); // 제거

  const defaultStatus = 'ACTIVE'; 
  
  try {
    const newMission = await prisma.mission.create({
      data: {
        storeId: storeId,
        title: title,
        content: content,
        status: defaultStatus,
      }
    });

    return newMission.id;
  } catch (err) {
    throw new Error(
      `미션 저장 중 오류가 발생했습니다. (${err.message}). mission 테이블과 store 테이블의 외래키 제약을 확인해주세요.`
    );
  } 
  // finally { conn.release(); } // 제거
};

// 등록된 Mission 정보 조회 (getMission)
export const getMission = async (missionId) => {
  // const conn = await pool.getConnection(); // 제거
  try {
    const mission = await prisma.mission.findUnique({ where: { id: missionId } });
    
    return mission; // findUnique는 객체 또는 null 반환
  } catch (err) {
    throw new Error(`미션 정보 조회 중 오류가 발생했습니다. (${err.message})`);
  } 
  // finally { conn.release(); } // 제거
};

// 미션 ID 존재 여부 확인 (isMissionExist)
export const isMissionExist = async (missionId) => {
  // const conn = await pool.getConnection(); // 제거
  try {
    const mission = await prisma.mission.findUnique({ where: { id: missionId } });
    
    // 객체가 존재하면 true, null이면 false 반환
    return mission !== null; 
  } catch (err) {
    throw new Error(`미션 존재 여부 확인 중 오류가 발생했습니다. (${err.message})`);
  } 
  // finally { conn.release(); } // 제거
};

/**
 * 특정 가게의 미션 목록을 조회합니다.
 * (여기서는 페이지네이션 없이 모든 미션을 조회한다고 가정합니다.)
 * @param {number} storeId - 가게 ID
 * @returns {Promise<Array>} 미션 목록
 */
export const getMissionsByStoreId = async (storeId) => {
  try {
    const missions = await prisma.mission.findMany({
      where: {
        storeId: storeId, // ⭐ 특정 가게 ID로 필터링
      },
      orderBy: {
        id: 'asc', // 미션 ID 기준 정렬
      },
      // 미션에 도전 중인 유저 정보가 필요하다면 include: { userMissions: true } 추가 가능
    });

    return missions;
  } catch (err) {
    throw new Error(`미션 목록 조회 중 오류가 발생했습니다. (${err.message})`);
  }
};