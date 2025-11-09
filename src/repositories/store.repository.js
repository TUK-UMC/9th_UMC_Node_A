import { pool, prisma } from "../db.config.js";
import { serializeBigIntDeep } from '../utils/serialize.js';

class storeRepository {
  // 가게 추가 api - 레포지토리
  async putStore(data) {
  const conn = await pool.getConnection();

    const [result] = await conn.query(
      `INSERT INTO store (regionId, storename, address, score, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?);`,
      [
        data.regionId,
        data.storename,
        data.address,
        data.score,
        data.created_at,
        data.updated_at
      ]
    );

    conn.release();
    return result.insertId;
  };

  // storename으로 가게 조회
  async findStoreByName(storename) {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(
        "SELECT * FROM store WHERE storename = ? LIMIT 1",
        [storename]
      );
      return rows.length ? rowss[0] : null;
    } finally {
      conn.release();
    }
  }

  // 가게 아이디로 가게 조회
async getAllStoreReviews(storeId, cursor) {
  const reviews = await prisma.Review.findMany({
    select: {
      id: true,
      store: {
        select: {
          storename: true
        }   // 가게 이름만
      },
      user: {
        select: {
          name: true
        }  // 유저 이름만
      },
      score: true,
      body: true
    },
    where: { storeId: storeId, id: { gt: cursor } },
    orderBy: { id: 'asc' },
    take: 5,
  });

  return serializeBigIntDeep(reviews);
};

// BigInt를 문자열로 변환하는 재귀 함수
serializeBigIntDeep(obj) {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'bigint') {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(serializeBigIntDeep);
  }

  if (typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = serializeBigIntDeep(obj[key]);
      }
    }
    return newObj;
  }

  return obj;
}

}

export default new storeRepository();