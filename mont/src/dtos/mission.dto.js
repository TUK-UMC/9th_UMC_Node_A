

class missionDto {

    // 요청 바디를 미션 객체로 변환하는 메서드
    bodyToMission(body) {
        const now = new Date();
        const deadline = new Date(body.deadline); //날짜 변환
        return {
            store_id: body.store_id,
            reward: body.reward,
            deadline: deadline,
            mission_spec: body.mission_spec,
            created_at: now,
            updated_at: now,
        };
    };

    // 미션 객체를 응답 형태로 변환하는 메서드
    responseFromMission(mission) {
        return {
            store_id: mission.store_id,
            reward: mission.reward,
            deadline: mission.deadline,
            mission_spec: mission.mission_spec,
            created_at: mission.created_at,
            updated_at: mission.updated_at,
        };
    };

    // 요청 바디를 유저 미션 객체로 변환하는 메서드
    bodyToUserMission(body) {
        const now = new Date();
        return {
            user_id: body.user_id,
            mission_id: body.mission_id,
            status: body.status,
            created_at: now,
            updated_at: now,
        };
    }

    // 유저 미션 객체를 응답 형태로 변환하는 메서드
    responseFromUserMission(userMission) {
        return {
            user_id: userMission.user_id,
            mission_id: userMission.mission_id,
            status: userMission.status,
            created_at: userMission.created_at,
            updated_at: userMission.updated_at,
        };
    }
}

export default new missionDto;
