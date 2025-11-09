// 이미 존재하는 이메일
export class DuplicateUserEmailError extends Error {
   errorCode = "U001";
 
   constructor(reason, data) {
     super(reason);
     this.reason = reason;
     this.data = data;
   }
 }

 // 가게 이름이 이미 존재하는 경우우
export class StoreAlreadyExistsError extends Error {
   errorCode = "U002";
 
   constructor(reason, data) {
     super(reason);
     this.reason = reason;
     this.data = data;
   }
 }

 // 가게가 존재하지 않는 경우 - 리뷰 추가 사용 시시
export class StoreNotFoundError extends Error {
   errorCode = "U003";
 
   constructor(reason, data) {
     super(reason);
     this.reason = reason;
     this.data = data;
   }
 }

 // 미션이 존재하지 않는 경우 - 유저 미션 추가 사용 시
export class MissionNotFoundError extends Error {
   errorCode = "U004";
 
   constructor(reason, data) {
     super(reason);
     this.reason = reason;
     this.data = data;
   }
 }

// 미션이 이미 도전중인 경우 - 유저 미션 추가 사용 시
export class MissionAlreadyOngoingError extends Error {
   errorCode = "U005";
 
   constructor(reason, data) {
     super(reason);
     this.reason = reason;
     this.data = data;
   }
 }

// 미션이 이미 완료된 경우 - 유저 미션 추가 사용 시
export class MissionAlreadyCompletedError extends Error {
   errorCode = "U006";
 
   constructor(reason, data) {
     super(reason);
     this.reason = reason;
     this.data = data;
   }
 }
 