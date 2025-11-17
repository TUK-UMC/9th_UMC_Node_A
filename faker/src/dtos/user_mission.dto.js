// src/dtos/user_mission.dto.js

// Service에서 받은 DB 결과를 클라이언트 응답 형식으로 변환
export const responseFromUserMission = (userMission) => {
  return {
    userMissionId: userMission.id,
    userId: userMission.user_id,
    missionId: userMission.mission_id,
    status: userMission.status, 
    createdAt: userMission.created_at,
  };
};

/**
 * 도전 중인 미션 목록 데이터를 응답 형식에 맞게 가공합니다.
 */
export const responseFromUserMissionsList = (userMissions) => {
    return userMissions.map(um => ({
        userMissionId: um.id,
        missionStatus: um.status,
        
        // Mission 상세 정보 추출 (um.mission 객체에서 가져옴)
        mission: {
            missionId: um.mission.id,
            storeId: um.mission.storeId,
            title: um.mission.title,
            content: um.mission.content,
        }
    }));
};