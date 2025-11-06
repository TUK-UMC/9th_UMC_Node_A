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