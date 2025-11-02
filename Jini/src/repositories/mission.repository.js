import { pool } from "../db.config.js";

// 미션 추가 (가게 미션 생성 - user_id 없음)
export const addMission = async (data) => {
    const conn = await pool.getConnection();

    try {
        const [result] = await pool.query(
            `INSERT INTO Mission (store_id, reward_point, title, description, boss_code) 
             VALUES (?, ?, ?, ?, ?);`,
            [
                data.storeId,
                data.rewardPoint,
                data.title,
                data.description,
                data.bossCode,
            ]
        );

        return result.insertId;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};

// 미션 정보 조회
export const getMission = async (missionId) => {
    const conn = await pool.getConnection();

    try {
        const [missions] = await pool.query(
            `SELECT * FROM Mission WHERE mission_id = ?;`,
            [missionId]
        );

        if (missions.length === 0) {
            return null;
        }

        return missions[0];
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};

// 미션 도전하기 (UserMission 테이블에 추가)
export const challengeMission = async (missionId, userId) => {
    const conn = await pool.getConnection();

    try {
        const [result] = await pool.query(
            `INSERT INTO UserMission (mission_id, user_id, status) 
             VALUES (?, ?, 'ongoing');`,
            [missionId, userId]
        );

        return result.insertId;
    } catch (err) {
        // UNIQUE 제약조건 위반 (이미 도전 중)
        if (err.code === 'ER_DUP_ENTRY') {
            return null;
        }
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};

// 사용자가 해당 미션을 이미 도전 중인지 확인
export const isUserChallenging = async (missionId, userId) => {
    const conn = await pool.getConnection();

    try {
        const [result] = await pool.query(
            `SELECT EXISTS(
                SELECT 1 FROM UserMission 
                WHERE mission_id = ? AND user_id = ?
            ) as isExists;`,
            [missionId, userId]
        );

        return result[0].isExists === 1;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};

// UserMission 정보 조회
export const getUserMission = async (userMissionId) => {
    const conn = await pool.getConnection();

    try {
        const [userMissions] = await pool.query(
            `SELECT * FROM UserMission WHERE id = ?;`,
            [userMissionId]
        );

        if (userMissions.length === 0) {
            return null;
        }

        return userMissions[0];
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};
