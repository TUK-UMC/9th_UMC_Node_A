import { prisma } from "../db/prisma.js";

// User 데이터 삽입
export const addUser = async (data) => {
    try {
        // 이메일 중복 확인
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existingUser) {
            return null;
        }

        // 사용자 생성
        const user = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                gender: data.gender,
                birth: data.birth,
                address: data.address,
                detailAddress: data.detailAddress,
                phoneNumber: data.phoneNumber,
                password: data.password,
                socialProvider: data.social_provider,
                socialId: data.social_id,
            }
        });

        return user.userId;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};

// 사용자 정보 얻기
export const getUser = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: { userId: parseInt(userId) }
        });

        console.log(user);

        if (!user) {
            return null;
        }

        return [user]; // 기존 코드와의 호환성을 위해 배열로 반환
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId, foodCategoryId) => {
    try {
        await prisma.userFavorCategory.create({
            data: {
                foodCategoryId: foodCategoryId,
                userId: userId
            }
        });

        return;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
    try {
        const preferences = await prisma.userFavorCategory.findMany({
            where: { userId: parseInt(userId) },
            include: {
                foodCategory: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                foodCategoryId: 'asc'
            }
        });

        // 기존 형식과 맞추기 위해 데이터 변환
        return preferences.map(pref => ({
            id: pref.id,
            food_category_id: pref.foodCategoryId,
            user_id: pref.userId,
            name: pref.foodCategory.name
        }));
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};
