import { pool } from "../db.config.js";

// 리뷰 추가
export const addReview = async (data) => {
    const conn = await pool.getConnection();

    try {
        const [result] = await pool.query(
            `INSERT INTO Review (store_id, user_id, rating, content) 
             VALUES (?, ?, ?, ?);`,
            [data.storeId, data.userId, data.rating, data.content]
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

// 리뷰 이미지 추가
export const addReviewImage = async (reviewId, imageUrl) => {
    const conn = await pool.getConnection();

    try {
        const [result] = await pool.query(
            `INSERT INTO ReviewImage (review_id, image_url) 
             VALUES (?, ?);`,
            [reviewId, imageUrl]
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

// 리뷰 정보 조회
export const getReview = async (reviewId) => {
    const conn = await pool.getConnection();

    try {
        const [reviews] = await pool.query(
            `SELECT * FROM Review WHERE review_id = ?;`,
            [reviewId]
        );

        if (reviews.length === 0) {
            return null;
        }

        return reviews[0];
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};

// 리뷰 이미지 목록 조회
export const getReviewImages = async (reviewId) => {
    const conn = await pool.getConnection();

    try {
        const [images] = await pool.query(
            `SELECT * FROM ReviewImage WHERE review_id = ? ORDER BY created_at ASC;`,
            [reviewId]
        );

        return images;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};
