// Mission DTO 변환 함수들

// 요청 body를 Mission 엔티티로 변환 (가게 미션 생성용)
export const bodyToMission = (body, storeId) => {
    return {
        storeId,
        rewardPoint: body.rewardPoint || body.reward_point || 0,
        title: body.title,
        description: body.description || "",
        bossCode: body.bossCode || body.boss_code || null,
    };
};

// Mission 도전 데이터 변환
export const bodyToMissionChallenge = (missionId, userId) => {
    return {
        missionId,
        userId,
        status: "ongoing", // 도전 시작 상태
    };
};

// Mission 엔티티를 응답 DTO로 변환
export const missionToResponse = (mission) => {
    return {
        missionId: mission.mission_id,
        storeId: mission.store_id,
        rewardPoint: mission.reward_point,
        title: mission.title,
        description: mission.description,
        bossCode: mission.boss_code,
        createdAt: mission.created_at,
        updatedAt: mission.updated_at,
    };
};

// UserMission을 포함한 응답 DTO로 변환
export const userMissionToResponse = (userMission, mission) => {
    return {
        userMissionId: userMission.id,
        missionId: mission.mission_id,
        storeId: mission.store_id,
        userId: userMission.user_id,
        rewardPoint: mission.reward_point,
        title: mission.title,
        description: mission.description,
        bossCode: mission.boss_code,
        status: userMission.status,
        challengedAt: userMission.challenged_at,
        completedAt: userMission.completed_at,
    };
};
