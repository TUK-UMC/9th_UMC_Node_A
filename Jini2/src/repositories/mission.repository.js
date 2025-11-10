import { prisma } from "../db/prisma.js";

// 미션 추가 (가게 미션 생성 - user_id 없음)
export const addMission = async (data) => {
    try {
        const mission = await prisma.mission.create({
            data: {
                storeId: data.storeId,
                rewardPoint: data.rewardPoint,
                title: data.title,
                description: data.description,
                bossCode: data.bossCode,
            }
        });

        return mission.missionId;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};

// 미션 정보 조회
export const getMission = async (missionId) => {
    try {
        const mission = await prisma.mission.findUnique({
            where: { missionId: parseInt(missionId) }
        });

        if (!mission) {
            return null;
        }

        return mission;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};

// 미션 도전하기 (UserMission 테이블에 추가)
export const challengeMission = async (missionId, userId) => {
    try {
        const userMission = await prisma.userMission.create({
            data: {
                missionId: missionId,
                userId: userId,
                status: 'ongoing',
            }
        });

        return userMission.id;
    } catch (err) {
        // UNIQUE 제약조건 위반 (이미 도전 중)
        if (err.code === 'P2002') { // Prisma unique constraint error code
            return null;
        }
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};

// 사용자가 해당 미션을 이미 도전 중인지 확인
export const isUserChallenging = async (missionId, userId) => {
    try {
        const userMission = await prisma.userMission.findFirst({
            where: {
                missionId: parseInt(missionId),
                userId: parseInt(userId),
            },
            select: { id: true }
        });

        return userMission !== null;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};

// UserMission 정보 조회
export const getUserMission = async (userMissionId) => {
    try {
        const userMission = await prisma.userMission.findUnique({
            where: { id: parseInt(userMissionId) }
        });

        if (!userMission) {
            return null;
        }

        return userMission;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};
