// src/services/user.service.js

// 1. DTO import
import { 
  responseFromUser, 
  responseFromUserReviews, 
  bodyToUserUpdate 
} from "../dtos/user.dto.js";

import { hashPassword } from "../utils/hash.util.js";
import { DuplicateUserEmailError, ResourceNotFoundError } from "../errors.js";

import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
  getUserReviews,
  updateUser
} from "../repositories/user.repository.js";


// 회원가입
export const userSignUp = async (data) => {
  const hashedPassword = await hashPassword(data.password);

  const joinUserId = await addUser({
    email: data.email,
    password: hashedPassword, 
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
  });

  if (joinUserId === null) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data); 
  }

  const preferencesToSet = data.preferences || [];
  for (const preference of preferencesToSet) {
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user: user[0], preferences });
};


// 사용자 리뷰 목록 조회
export const listUserReviews = async (userId) => {
  const reviewsWithStore = await getUserReviews(userId);
  return responseFromUserReviews(reviewsWithStore); 
};

// 사용자 정보 수정
export const updateUserInfo = async (userId, body) => {
  // 1. 사용자 존재 여부 확인
  const userExists = await getUser(userId);
  if (!userExists) {
    throw new ResourceNotFoundError("사용자", { userId });
  }

  // 2. 데이터 변환 및 업데이트 실행
  const updateData = bodyToUserUpdate(body);
  await updateUser(userId, updateData);

  // 3. 업데이트된 최신 정보 조회 및 반환
  const updatedUser = await getUser(userId);
  const preferences = await getUserPreferencesByUserId(userId); 

  return responseFromUser({ user: updatedUser[0], preferences });
};