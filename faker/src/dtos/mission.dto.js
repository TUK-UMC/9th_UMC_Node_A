// src/dtos/mission.dto.js

// 미션 요청 Body를 Service로 전달할 객체로 변환
export const bodyToMission = (body) => {
  return {
    title: body.title, // 미션 제목
    content: body.content, // 미션 내용
  };
};

// Service에서 받은 DB 결과를 클라이언트 응답 형식으로 변환
export const responseFromMission = (mission) => {
  return {
    missionId: mission.id,
    storeId: mission.store_id, // 미션 대상 가게 ID
    title: mission.title,
    content: mission.content,
    status: mission.status, // DB에 'status' 필드가 있다고 가정
    createdAt: mission.created_at,
  };
};