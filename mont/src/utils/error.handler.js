// 커스텀 에러와 일반 에러를 구분하여 처리하는 모듈

import { StatusCodes } from "http-status-codes";

class ErrorHandler {
   /**
      * 커스텀 에러 인스턴스 확인
      * @param {Error} error - 에러 객체
      * @param {Array<Function>} errorTypes - 확인할 커스텀 에러 타입 배열
      * @returns {boolean} - 커스텀 에러인지 여부
      */
   isCustomError(error, errorTypes = []) {
      return errorTypes.some(ErrorType => error instanceof ErrorType);
   }

   /**
      * 커스텀 에러 처리
      * @param {Error} error - 커스텀 에러 객체
      * @returns {Object} - 처리된 에러 객체
      */
   handleCustomError(error) {
      return {
         statusCode: StatusCodes.BAD_REQUEST,
         errorCode: error.errorCode,
         reason: error.reason,
         data: error.data,
      };
   }

   /**
      * 일반 에러 처리
      * @param {Error} error - 일반 에러 객체
      * @param {string} defaultErrorCode - 기본 에러 코드
      * @param {string} defaultReason - 기본 에러 메시지
      * @returns {Object} - 처리된 에러 객체
      */
   handleGeneralError(error, defaultErrorCode, defaultReason) {
      return {
         statusCode: StatusCodes.BAD_REQUEST,
         errorCode: defaultErrorCode,
         reason: error.message || defaultReason,
         data: null,
      };
   }

   /**
      * 통합 에러 처리 핸들러
      * @param {Error} error - 에러 객체
      * @param {Array<Function>} customErrorTypes - 커스텀 에러 타입 배열
      * @param {string} defaultErrorCode - 기본 에러 코드
      * @param {string} defaultReason - 기본 에러 메시지
      * @returns {Object} - 처리된 에러 객체
      */
   handle(error, customErrorTypes = [], defaultErrorCode, defaultReason) {
      if (this.isCustomError(error, customErrorTypes)) {
         return this.handleCustomError(error);
      }
      return this.handleGeneralError(error, defaultErrorCode, defaultReason);
   }
}

export default new ErrorHandler();
