export const bodyToUser = (body) => {
  const birth = new Date(body.birth); //날짜 변환

  return {
    email: body.email, //필수 
    password: body.password, // ⭐ 추가: 비밀번호
    name: body.name, // 필수
    gender: body.gender, // 필수
    birth, // 필수
    address: body.address || "", //선택 
    detailAddress: body.detailAddress || "", //선택 
    phoneNumber: body.phoneNumber,//필수
    preferences: body.preferences,// 필수 
  };
};

/**
 * Service에서 받은 사용자 정보(user)와 선호 카테고리 리스트(preferences)를 
 * 클라이언트 응답 형식에 맞게 변환합니다.
 */
export const responseFromUser = ({ user, preferences }) => {
  
  // 1. 선호 카테고리 배열에서 이름만 추출하여 문자열 배열로 변환
  // ⭐ [수정 반영] Prisma의 JOIN 결과 구조 (preference.foodCategory.name)에 맞게 수정
  const preferFoods = preferences.map(preference => 
    preference.category.name // Repository에서 category: { select: { name: true } } 로 가져왔다고 가정
  ); 
  
  // 2. DB 필드명을 클라이언트용 카멜 케이스로 변환하고 필요한 필드만 선택
  return {
    userId: user.id, // Primary Key
    email: user.email,
    name: user.name,
    gender: user.gender,
    // age 필드는 DB에 없거나 DTO에서 누락될 수 있으므로, 일단 제거하거나 유효성 검사 필요
    // age: user.age, 
    
    // Prisma 스키마 필드 이름(address) 사용
    address: user.address, 
    detailAddress: user.detailAddress, // DB의 detail_address가 DTO로 넘어왔다고 가정
    
    // DB 필드명 'phone_num'을 DTO 출력명 'phoneNumber'로 변환
    phoneNumber: user.phoneNumber, // DB의 phone_number가 DTO로 넘어왔다고 가정
    
    // ⭐ [수정 반영] 선호 카테고리 리스트 이름을 변경
    preferCategory: preferFoods,
    
    // 생성/수정일 정보는 Date 객체를 ISO 문자열로 변환하여 제공
    createdAt: user.createdAt, // Prisma는 created_at을 createdAt으로 변환할 수 있습니다.
    updatedAt: user.updatedAt,
  };
};