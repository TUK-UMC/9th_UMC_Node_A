// src/repositories/user_mission.repository.js

import { prisma } from "../db.config.js"; 

// 미션 도전 중복 여부 확인 (isAlreadyChallenging)
export const isAlreadyChallenging = async (userId, missionId) => {
  try {
    const mission = await prisma.userMission.findFirst({
      where: {
        userId: userId,
        missionId: missionId,
        status: 'IN_PROGRESS',
      }
    });
    return mission !== null; 
  } catch (err) {
    throw new Error(`도전 중 미션 확인 중 오류가 발생했습니다. (${err.message})`);
  } 
};

// 유저의 미션 도전 정보 저장 (addUserMission)
export const addUserMission = async (userId, missionId) => {
  
  const defaultStatus = 'IN_PROGRESS'; 
  
  try {
    const newUserMission = await prisma.userMission.create({
      data: {
        userId: userId,
        missionId: missionId,
        status: defaultStatus,
      }
    });
    
    return newUserMission.id;
  } catch (err) {
    throw new Error(
      `유저 미션 도전 정보 저장 중 오류가 발생했습니다. (${err.message}). 외래키 제약을 확인해주세요.`
    );
  } 
};

// 등록된 UserMission 정보 조회 (getUserMission)
export const getUserMission = async (userMissionId) => {
  try {
    const userMission = await prisma.userMission.findUnique({ where: { id: userMissionId } });
    
    return userMission;
  } catch (err) {
    throw new Error(`유저 미션 정보 조회 중 오류가 발생했습니다. (${err.message})`);
  } 
};

// 특정 사용자가 현재 도전 중인 미션 목록을 조회 (getChallengingMissions)
export const getChallengingMissions = async (userId, missionId) => {
  try {
    const missions = await prisma.userMission.findMany({
      where: {
        userId: userId,
        missionId: missionId,
        status: 'IN_PROGRESS', 
      },
      include: {
        mission: true, 
      },
      orderBy: {
        id: 'asc',
      }
    });

    return missions;
  } catch (err) {
    throw new Error(`도전 중인 미션 목록 조회 중 오류가 발생했습니다. (${err.message})`);
  }
};