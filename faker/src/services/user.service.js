// src/services/user.service.js

import { responseFromUser, responseFromUserReviews } from "../dtos/user.dto.js"; // DTO 함수 import 정리
import { hashPassword } from "../utils/hash.util.js";
import { DuplicateUserEmailError } from "../errors.js"; // ⭐ [추가] 사용자 정의 에러 import

import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
  getUserReviews, // 새로 추가한 함수 import
} from "../repositories/user.repository.js";

export const userSignUp = async (data) => {
  // 1. 비밀번호 해싱
  const hashedPassword = await hashPassword(data.password);

  // 2. 사용자 추가 (해싱된 비밀번호 사용)
  // Repository 함수 호출 시 db 인자는 제거하고 data만 전달합니다.
  const joinUserId = await addUser({
    email: data.email,
    password: hashedPassword, // 해싱된 비밀번호 전달
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
    // data 객체는 preferences 필드를 포함하고 있으나, addUser는 DB 필드만 사용한다고 가정합니다.
  });

  if (joinUserId === null) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data); 
  }

  // 3. 선호 카테고리 매핑
  const preferencesToSet = data.preferences || []; // 안전하게 빈 배열 처리
  for (const preference of preferencesToSet) {
    await setPreference(joinUserId, preference);
  }

  // 4. 조회 후 응답
  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};

/**
 * 사용자 ID를 기반으로 해당 사용자의 모든 리뷰 목록을 조회
 */
export const listUserReviews = async (userId) => {
  const reviewsWithStore = await getUserReviews(userId);

  // DTO를 사용하여 필요한 데이터만 추출
  return responseFromUserReviews(reviewsWithStore); 
};