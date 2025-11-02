import { pool } from "../db.config.js";

class storeRepository {
  async putStore(data) {
  const conn = await pool.getConnection();

    const [result] = await pool.query(
      `INSERT INTO store (region_id, storename, address, score) VALUES (?, ?, ?, ?);`,
      [
        data.region_id,
        data.storename,
        data.address,
        data.score
      ]
    );

    return result.insertId;
    conn.release();
  };

  async findStoreByName(storename) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT * FROM store WHERE storename = ? LIMIT 1",
      [storename]
    );
    return rows.length ? rows[0] : null;
  } finally {
    conn.release();
  }
}
}

export default new storeRepository();