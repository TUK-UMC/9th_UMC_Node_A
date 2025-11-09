// 요청 body를 User 데이터로 변환 (입력용)
export const bodyToUser = (body) => {
    const birth = new Date(body.birth); //날짜 변환

    return {
        email: body.email, //필수
        name: body.name, // 필수
        gender: body.gender, // 필수
        birth, // 필수
        address: body.address || "", //선택
        detailAddress: body.detailAddress || "", //선택
        phoneNumber: body.phoneNumber, //필수
        password: body.password, // 소셜 로그인이면 undefined
        social_provider: body.social_provider,
        social_id: body.social_id,
        preferences: body.preferences, // 필수
    };
};

// DB 데이터를 응답 형식으로 변환 (출력용)
export const responseFromUser = ({ user, preferences }) => {
    const userInfo = Array.isArray(user) ? user[0] : user;
    
    return {
        email: userInfo.email,
        name: userInfo.name,
        gender: userInfo.gender,
        birth: userInfo.birth,
        address: userInfo.address,
        detailAddress: userInfo.detailAddress,
        phoneNumber: userInfo.phoneNumber,
        preferences: preferences.map(pref => ({
            id: pref.id,
            category: pref.name
        }))
    };
};