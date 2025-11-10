// 이메일 중복 에러
export class DuplicateUserEmailError extends Error {
    errorCode = "U001";

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

// 존재하지 않는 리소스 에러
export class NotFoundError extends Error {
    errorCode = "COMMON001";

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

// 잘못된 요청 에러
export class BadRequestError extends Error {
    errorCode = "COMMON002";

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

// 중복 에러 (일반)
export class DuplicateError extends Error {
    errorCode = "COMMON003";

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}
