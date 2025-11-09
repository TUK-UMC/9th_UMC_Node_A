import { prisma } from "../db/prisma.js";

// 가게 추가
export const addStore = async (data) => {
    try {
        const store = await prisma.store.create({
            data: {
                name: data.name,
                regionName: data.regionName,
                address: data.address,
                description: data.description,
                status: data.status,
            }
        });

        return store.storeId;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};

// 가게 정보 조회
export const getStore = async (storeId) => {
    try {
        const store = await prisma.store.findUnique({
            where: { storeId: parseInt(storeId) }
        });

        if (!store) {
            return null;
        }

        return store;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};

// 가게 존재 여부 확인
export const isStoreExists = async (storeId) => {
    try {
        const store = await prisma.store.findUnique({
            where: { storeId: parseInt(storeId) },
            select: { storeId: true }
        });

        return store !== null;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};
