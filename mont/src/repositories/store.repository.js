import { prisma } from "../db.config.js";

class storeRepository {
  // 가게 추가 api - 레포지토리
  async putStore(data) {
    const store = await prisma.store.create({
      data: {
        regionId: data.regionId,
        storename: data.storename,
        address: data.address,
        score: data.score,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    });
    return store.id;
  };

  // storename으로 가게 조회
  async findStoreByName(storename) {
    const store = await prisma.store.findFirst({
      where: { storename: storename }
    });
    return store;
  }

  // store_id로 가게 조회
  async findStoreById(storeId) {
    const store = await prisma.store.findFirst({
      where: { id: BigInt(storeId) }
    });
    return store;
  }

  // 가게 아이디로 가게 조회
  async getAllStoreReviews(storeId, cursor) {
    return await prisma.review.findMany({
      select: {
        id: true,
        store: {
          select: { storename: true }
        },
        user: {
          select: { name: true }
        },
        score: true,
        body: true
      },
      where: { storeId: BigInt(storeId), id: { gt: BigInt(cursor) } },
      orderBy: { id: 'asc' },
      take: 5,
    });
  }


}

export default new storeRepository();