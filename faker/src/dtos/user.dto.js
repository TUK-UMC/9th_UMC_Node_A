export const bodyToUser = (body) => {
  const birth = new Date(body.birth); //날짜 변환

  return {
    email: body.email, //필수 
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
 * * [가정]
 * 1. user 객체 필드는 DB 스키마 그대로 넘어옴 (id, email, name, age, spec_address, phone_num 등)
 * 2. preferences 배열의 각 항목은 { category: '한식' } 형태로 카테고리 이름 문자열을 포함하고 있음 (Service 레이어에서 JOIN을 통해 가공되었다고 가정).
 */
export const responseFromUser = ({ user, preferences }) => {
  
  // 1. 선호 카테고리 배열에서 이름만 추출하여 문자열 배열로 변환
  // (Service에서 category 테이블과 조인하여 이름이 'category' 필드에 담겨 넘어왔다고 가정)
  const preferenceList = preferences.map(pref => pref.name); 

  // 2. DB 필드명을 클라이언트용 카멜 케이스로 변환하고 필요한 필드만 선택
  return {
    userId: user.id, // Primary Key
    email: user.email,
    name: user.name,
    gender: user.gender,
    age: user.age, // DB에 'age' 필드가 존재하므로 포함
    
    // DB 필드명 'spec_address'를 DTO 출력명 'detailAddress'로 변환
    address: user.address, 
    detailAddress: user.spec_address, 
    
    // DB 필드명 'phone_num'을 DTO 출력명 'phoneNumber'로 변환
    phoneNumber: user.phone_num, 
    
    // 최종 가공된 선호 카테고리 리스트
    preferences: preferenceList,
    
    // 생성/수정일 정보는 Date 객체를 ISO 문자열로 변환하여 제공
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
};