class userDto {

    // 회원가입 요청 바디를 유저 객체로 변환
    bodyToUser(body) {
        const birth = new Date(body.birth); //날짜 변환
        const now = new Date();
        return {
            email: body.email, //필수 
            name: body.name, // 필수
            gender: body.gender, // 필수
            birth: birth, // 필수
            address: body.address || "", //선택 
            detailAddress: body.detailAddress || "", //선택 
            phoneNumber: body.phoneNumber,//필수
            preferences: body.preferences,// 필수 
            created_at: now,
            updated_at: now,
        };
    };    

    // 유저 객체를 응답 형식에 맞게 변환
    responseFromUser(user, preferences) {
        const preferFoods = preferences.map(
        (preference) => preference.foodCategory.name);

        return {
            email: user.email,
            name: user.name,
            preferCategory: preferFoods,
                };
        };
}

export default new userDto();
