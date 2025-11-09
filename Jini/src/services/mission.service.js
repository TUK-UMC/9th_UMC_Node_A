import {
    addMission,
    getMission,
    challengeMission,
    isUserChallenging,
    getUserMission,
} from "../repositories/mission.repository.js";
import { isStoreExists } from "../repositories/store.repository.js";
import { missionToResponse, userMissionToResponse } from "../dtos/mission.dto.js";
import { NotFoundError, DuplicateError } from "../errors.js";

// 미션 추가 (가게 미션 생성)
export const createMission = async (data) => {
    // 가게 존재 여부 확인
    const storeExists = await isStoreExists(data.storeId);
    if (!storeExists) {
        throw new NotFoundError("존재하지 않는 가게입니다.", { storeId: data.storeId });
    }

    // 미션 추가
    const missionId = await addMission(data);

    // 추가된 미션 정보 조회
    const mission = await getMission(missionId);

    // 응답 DTO로 변환하여 반환
    return missionToResponse(mission);
};

// 미션 도전하기
export const startMissionChallenge = async (missionId, userId) => {
    // 미션 존재 여부 확인
    const mission = await getMission(missionId);
    if (!mission) {
        throw new NotFoundError("존재하지 않는 미션입니다.", { missionId });
    }

    // 사용자가 이미 도전 중인지 확인
    const alreadyChallenging = await isUserChallenging(missionId, userId);
    if (alreadyChallenging) {
        throw new DuplicateError("이미 도전 중인 미션입니다.", { missionId, userId });
    }

    // 미션 도전 시작 (UserMission 테이블에 추가)
    const userMissionId = await challengeMission(missionId, userId);
    if (!userMissionId) {
        throw new NotFoundError("미션 도전에 실패했습니다.", { missionId, userId });
    }

    // 생성된 UserMission 정보 조회
    const userMission = await getUserMission(userMissionId);

    // 응답 DTO로 변환하여 반환
    return userMissionToResponse(userMission, mission);
};
