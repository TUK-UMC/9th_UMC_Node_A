import { prisma } from '../db.config.js';

class userRepository {
    // User 데이터 삽입
    async addUser(data) {
    const user = await prisma.user.findFirst({ where: { email: data.email } });
    if (user) {
        return null;
    }

    const created= await prisma.user.create({ data: data });
    return created.id;
    };

    // 사용자 정보 얻기
    async getUser(userId){
    const user = await prisma.user.findFirstOrThrow({ where: { id: userId } });
    return user;
    };

    // 음식 선호 카테고리 매핑
    async setPreference(userId, foodCategoryId) {
        if (!userId || !foodCategoryId) {
            throw new Error("Invalid arguments: userId or foodCategoryId is missing");
        }
        await prisma.userFavorCategory.create({
            data: {
            user: { connect: { id: userId } },
            foodCategory: { connect: { id: foodCategoryId } },
            }
        });
    }

    // 사용자 선호 카테고리 반환
    async getUserPreferencesByUserId(userId){
    const preferences = await prisma.userFavorCategory.findMany({
        select: {
        id: true,
        userId: true,
        foodCategoryId: true,
        foodCategory: true,
        },
        where: { userId: userId },
        orderBy: { foodCategoryId: "asc" },
    });

    return preferences;
    };
}

export default new userRepository();