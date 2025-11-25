import bcrypt from "bcrypt";
import { responseFromUser } from "../dtos/user.dto.js";
import {
    addUser,
    getUser,
    getUserPreferencesByUserId,
    setPreference,
    updateUser,
    clearUserPreferences,
    getUserByEmail,
} from "../repositories/user.repository.js";
import { DuplicateUserEmailError, NotFoundError } from "../errors.js";
import { generateAccessToken, generateRefreshToken } from "../auth.config.js";

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

// 로그인 서비스
export const userLogin = async (email, password) => {
    // 이메일로 사용자 찾기
    const user = await getUserByEmail(email);
    
    if (!user) {
        throw new NotFoundError("존재하지 않는 이메일입니다.", { email });
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
        throw new Error("비밀번호가 일치하지 않습니다.");
    }

    // JWT 토큰 생성
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
        accessToken,
        refreshToken,
        user: {
            userId: user.userId,
            email: user.email,
            name: user.name
        }
    };
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