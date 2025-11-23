import bcrypt from "bcrypt";
import { responseFromUser } from "../dtos/user.dto.js";
import {
    addUser,
    getUser,
    getUserPreferencesByUserId,
    setPreference,
    updateUser,
    clearUserPreferences,
} from "../repositories/user.repository.js";
import { DuplicateUserEmailError, NotFoundError } from "../errors.js";

export const userSignUp = async (data) => {
    // 소셜 로그인이 아닌 경우에만 비밀번호 해싱
    let hashedPassword = null;
    if (data.password) {
        hashedPassword = await bcrypt.hash(data.password, 10);
    }

    const joinUserId = await addUser({
        email: data.email,
        name: data.name,
        gender: data.gender,
        birth: data.birth,
        address: data.address,
        detailAddress: data.detailAddress,
        phoneNumber: data.phoneNumber,
        password: hashedPassword,
        social_provider: data.social_provider || null,
        social_id: data.social_id || null,
    });

    if (joinUserId === null) {
        throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
    }

    for (const preference of data.preferences) {
        await setPreference(joinUserId, preference);
    }

    const user = await getUser(joinUserId);
    const preferences = await getUserPreferencesByUserId(joinUserId);

    return responseFromUser({ user, preferences });
};

// 프로필 수정 서비스 (로그인한 사용자가 자신의 정보를 수정)
export const userUpdateProfile = async (userId, data) => {
    // 사용자 존재 여부 확인
    const existingUser = await getUser(userId);
    if (!existingUser || existingUser.length === 0) {
        throw new NotFoundError("존재하지 않는 사용자입니다.", { userId });
    }

    // 비밀번호가 있으면 해싱
    let hashedPassword = null;
    if (data.password) {
        hashedPassword = await bcrypt.hash(data.password, 10);
    }

    // 사용자 정보 업데이트
    await updateUser(userId, {
        name: data.name,
        gender: data.gender,
        birth: data.birth,
        address: data.address,
        detailAddress: data.detailAddress,
        phoneNumber: data.phoneNumber,
        password: hashedPassword,
    });

    // 선호 카테고리 업데이트 (기존 삭제 후 새로 추가)
    if (data.preferences && data.preferences.length > 0) {
        await clearUserPreferences(userId);
        for (const preference of data.preferences) {
            await setPreference(userId, preference);
        }
    }

    const user = await getUser(userId);
    const preferences = await getUserPreferencesByUserId(userId);

    return responseFromUser({ user, preferences });
};