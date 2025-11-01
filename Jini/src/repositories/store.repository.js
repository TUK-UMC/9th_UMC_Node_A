import { pool } from "../db.config.js";

// 가게 추가
export const addStore = async (data) => {
    const conn = await pool.getConnection();

    try {
        const [result] = await pool.query(
            `INSERT INTO Store (name, region_name, address, description, status) 
             VALUES (?, ?, ?, ?, ?);`,
            [
                data.name,
                data.regionName,
                data.address,
                data.description,
                data.status,
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

// 가게 정보 조회
export const getStore = async (storeId) => {
    const conn = await pool.getConnection();

    try {
        const [stores] = await pool.query(
            `SELECT * FROM Store WHERE store_id = ?;`,
            [storeId]
        );

        if (stores.length === 0) {
            return null;
        }

        return stores[0];
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};

// 가게 존재 여부 확인
export const isStoreExists = async (storeId) => {
    const conn = await pool.getConnection();

    try {
        const [result] = await pool.query(
            `SELECT EXISTS(SELECT 1 FROM Store WHERE store_id = ?) as isExists;`,
            [storeId]
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
