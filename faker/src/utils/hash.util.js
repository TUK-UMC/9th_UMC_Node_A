// src/utils/hash.util.js

import bcrypt from "bcrypt";

// 해싱에 사용할 솔트(Salt) 라운드 수 정의
const SALT_ROUNDS = 10;

/*
 * 비밀번호를 해싱합니다.
 * @param {string} password - 해싱할 평문 비밀번호
 * @returns {Promise<string>} 해싱된 비밀번호
 */
export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};