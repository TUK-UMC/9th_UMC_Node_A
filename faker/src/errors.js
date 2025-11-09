// src/errors.js

/**
 * 중복된 사용자 이메일로 인해 회원가입에 실패했을 때 사용되는 오류 클래스입니다.
 */
export class DuplicateUserEmailError extends Error {
  // ⭐ 고유한 에러 코드 정의
  errorCode = "U001"; // 'U'ser Error Code 001

  // 409 Conflict 또는 400 Bad Request에 해당하는 HTTP 상태 코드를 지정할 수 있습니다.
  statusCode = 409; 

  constructor(reason, data) {
    // Error 클래스의 생성자(super)에 에러 메시지를 전달합니다.
    super(reason); 
    
    // 이 클래스의 고유한 속성을 설정합니다.
    this.reason = reason;
    this.data = data;
    
    // 에러 스택 트레이스를 정리합니다 (Node.js에서 유용)
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, DuplicateUserEmailError);
    }
  }
}