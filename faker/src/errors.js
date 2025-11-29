// src/errors.js

// [추가] 모든 커스텀 오류의 기본 클래스로, 공통 속성을 정의합니다.
 
class BaseError extends Error {
    constructor(reason, statusCode = 500, errorCode = "UNKNOWN_ERROR", data) {
        super(reason);
        // 오류의 HTTP 상태 코드
        this.statusCode = statusCode; 
        // 고유한 식별 코드
        this.errorCode = errorCode; 
        this.reason = reason;
        this.data = data;
        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, BaseError);
        }
    }
}

/*
 * [U001] 회원가입 시 이메일 중복 오류
 * (BaseError를 상속받아 일관성 확보)
 */
export class DuplicateUserEmailError extends BaseError {
    constructor(reason, data) {
        // super()를 호출하여 BaseError의 속성을 설정
        // 상태 코드 409 (Conflict), 에러 코드 "U001"
        super(reason, 409, "U001", data); 
    }
}

// 추가할 수 있는 다른 에러 클래스들

// [G001] 리소스를 찾을 수 없는 일반적인 오류 (404 Not Found)
export class ResourceNotFoundError extends BaseError {
    constructor(resourceName, data) {
        super(`${resourceName}을(를) 찾을 수 없습니다.`, 404, "G001", data); 
    }
}

// [G002] 필수 입력 누락 또는 유효성 검사 실패 (400 Bad Request)
export class InvalidInputError extends BaseError {
    constructor(reason, data) {
        super(reason, 400, "G002", data); 
    }
}

// [M001] 유저가 이미 미션을 도전 중인 경우 (409 Conflict)
export class AlreadyChallengingError extends BaseError {
    constructor(reason, data) {
        super(reason, 409, "M001", data);
    }
}