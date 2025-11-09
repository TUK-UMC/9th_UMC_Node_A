import { responseFromUser } from "../dtos/user.dto.js";

import { hashPassword } from "../utils/hash.util.js"; // ⭐ 추가: 해싱 유틸리티 import

import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
  getUserReviews, // 새로 추가한 함수 import
} from "../repositories/user.repository.js";

import { 
    // ...
    responseFromUserReviews // 새로 만들 DTO 함수 import
} from "../dtos/user.dto.js";

export const userSignUp = async (data) => {
  // 1. 비밀번호 해싱
  const hashedPassword = await hashPassword(data.password); // ⭐ 해싱 적용

  // 2. 사용자 추가 (해싱된 비밀번호 사용)
  const joinUserId = await addUser({
    email: data.email,
    password: hashedPassword, // ⭐ 해싱된 비밀번호 전달
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
  });

  if (joinUserId === null) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  for (const preference of data.preferences) {
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};

/**
 * 사용자 ID를 기반으로 해당 사용자의 모든 리뷰 목록을 조회합니다.
 * @param {number} userId - 사용자 ID
 * @returns {object} 가공된 리뷰 응답 데이터
 */
export const listUserReviews = async (userId) => {
  const reviewsWithStore = await getUserReviews(userId);

  // DTO를 사용하여 필요한 데이터만 추출하고 가공
  return responseFromUserReviews(reviewsWithStore); 
};