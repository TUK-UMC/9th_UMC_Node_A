// src/repositories/user.repository.js

// Prisma Client import (db.config.js에서 prisma 객체를 export 한다고 가정)
import { prisma } from "../db.config.js"; 


// User 데이터 삽입 (addUser)
export const addUser = async (data) => {
  try {
    // 이메일 중복 확인 (findFirst 사용)
    const user = await prisma.user.findFirst({ 
      where: { email: data.email }
    });

    if (user) {
      return null;
    }

    // 사용자 데이터 삽입 (create 사용)
    const created = await prisma.user.create({ data: data });

    return created.id;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
    );
  }
};


// 사용자 정보 얻기 (getUser)
export const getUser = async (userId) => {
  try {
    // ⭐ 지침 반영: findFirstOrThrow 사용
    // 데이터가 없으면 자동 에러 발생 -> Service 계층에서 catch 해야 함
    const user = await prisma.user.findFirstOrThrow({ 
      where: { id: userId } 
    });

    // findFirstOrThrow는 단일 객체를 반환합니다.
    // 기존 Service와의 호환성을 위해 배열 형태로 래핑하여 반환합니다.
    return [user]; 
    
  } catch (err) {
    // 데이터가 없을 때 발생하는 에러(NotFoundError)를 포함한 모든 에러 처리
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
    );
  }
};


// 음식 선호 카테고리 매핑 (setPreference)
export const setPreference = async (userId, foodCategoryId) => {
  try {
    // ⭐ 지침 반영: create 메서드 사용 및 인자 전달 (userId, foodCategoryId)
    await prisma.userFavorCategory.create({
      data: {
        userId: userId,
        categoryId: foodCategoryId, // 스키마의 categoryId 필드에 foodCategoryId 전달
      },
    });

    return;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
    );
  }
};


// 사용자 선호 카테고리 반환 (getUserPreferencesByUserId)
export const getUserPreferencesByUserId = async (userId) => {
  try {
    const preferences = await prisma.userFavorCategory.findMany({
      where: { userId: userId },
      select: { 
        // FoodCategory 모델의 name 필드만 가져오도록 명시
        category: { 
          select: {
            name: true,
          },
        },
      },
      orderBy: { categoryId: "asc" }, // categoryId 기준으로 정렬
    });

    return preferences;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
    );
  }
};