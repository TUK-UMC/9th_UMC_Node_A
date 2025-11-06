import { responseFromUser } from "../dtos/user.dto.js";

import { hashPassword } from "../utils/hash.util.js"; // ⭐ 추가: 해싱 유틸리티 import

import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories/user.repository.js";

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