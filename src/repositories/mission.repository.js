import { pool } from "../db.config.js";

class missionRepository {

  // 가게 미션 추가 api - 레포지토리
  async putMission(data) {
    const conn = await pool.getConnection();   

    try {
      const [result] = await conn.query(
        `INSERT INTO mission (storeId, reward, deadline, missionSpec, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?);`,
        [
          data.store_id,
          data.reward,
          data.deadline,
          data.mission_spec,
          data.created_at,
          data.updated_at,
        ]
      );

      return result.insertId;
    } catch (error) {
      console.error("Error in putMission:", error);
      throw error;
    } finally {
      conn.release();
    }
  } 

  // 유저 미션 추가 api - 레포지토리
  async PutUserMission(data) {
    const conn = await pool.getConnection();

    try {
      const [result] = await conn.query(
        `INSERT INTO user_mission (user_id, mission_id, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?);`,
        [
          data.user_id,
          data.mission_id,
          data.status,
          data.created_at,
          data.updated_at,
        ]
      );

      return result.insertId;
    } catch (error) {
      console.error("Error in PutUserMissison:", error);
      throw error;
    } finally {
      conn.release();
    }
  }    

  // 미션 테이블에서 mission 아이디로 미션 조회
  async findMissionById(mission_id) {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(
        "SELECT * FROM mission WHERE id = ? LIMIT 1",
        [mission_id]);
      return rows.length ? rows[0] : null; // 미션이 있으면 반환, 없으면 null
    } finally {
      conn.release
    }
  }

  // 유저 미션 테이블에서 mission 아이디로 유저 미션 조회
  async findUserMissionByMissionId(mission_id) {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(
        "SELECT * FROM user_mission WHERE mission_id = ? LIMIT 1",
        [mission_id]);
      return rows.length ? rows[0] : null; // 유저 미션이 있으면 반환, 없으면 null
    } finally {
      conn.release
    }
  }
}

export default new missionRepository();