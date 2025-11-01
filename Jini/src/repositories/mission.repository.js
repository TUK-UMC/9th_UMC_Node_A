import { pool } from "../db.config.js";

// 미션 추가 (가게 미션 생성)
export const addMission = async (data) => {
    const conn = await pool.getConnection();

    try {
        const [result] = await pool.query(
            `INSERT INTO Mission (store_id, user_id, reward_point, title, description, status, boss_code) 
             VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [
                data.storeId,
                data.userId,
                data.rewardPoint,
                data.title,
                data.description,
                data.status,
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

// 미션 도전하기 (미션에 user_id 할당 및 상태 변경)
export const challengeMission = async (missionId, userId) => {
    const conn = await pool.getConnection();

    try {
        const [result] = await pool.query(
            `UPDATE Mission 
             SET user_id = ?, status = 'ongoing', updated_at = CURRENT_TIMESTAMP 
             WHERE mission_id = ? AND user_id IS NULL AND status = 'waiting';`,
            [userId, missionId]
        );

        return result.affectedRows > 0;
    } catch (err) {
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
                SELECT 1 FROM Mission 
                WHERE mission_id = ? AND user_id = ? AND status IN ('ongoing', 'completed')
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

// 미션이 도전 가능한 상태인지 확인
export const isMissionAvailable = async (missionId) => {
    const conn = await pool.getConnection();

    try {
        const [result] = await pool.query(
            `SELECT EXISTS(
                SELECT 1 FROM Mission 
                WHERE mission_id = ? AND user_id IS NULL AND status = 'waiting'
            ) as isAvailable;`,
            [missionId]
        );

        return result[0].isAvailable === 1;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};
