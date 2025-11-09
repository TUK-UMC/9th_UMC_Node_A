import { pool, prisma } from "../db.config.js";

class reviewRepository {
  // 리뷰 추가 api - 레포지토리
    async putReview(data) {
      const conn = await pool.getConnection();    // connection pool 얻기
      
      try {
        const [result] = await conn.query(
          `INSERT INTO review (userId, storeId, body, score, createdAt) VALUES (?, ?, ?, ?, ?);`,
          [
            data.user_id,
            data.store_id,
            data.contents,
            data.score,
            data.created_at,
          ]
        );
    
        conn.release();
        return result.insertId; // 삽입된 리뷰의 ID 반환
      } catch (error) {
        conn.release();
        console.error("Error in putReview:", error);
        throw error;
      } 
    }

    // 가게 존재 여부 확인
    
}

export default new reviewRepository();
