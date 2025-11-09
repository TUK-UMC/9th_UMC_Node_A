// src/controllers/store.controller.js

import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { registerStore, listStoreReviews } from "../services/store.service.js"; // listStoreReviews도 import 명시

export const handleStoreRegister = async (req, res, next) => {
  try {
    console.log("새로운 가게 등록을 요청했습니다!");
    console.log("body:", req.body);
    
    // DTO를 이용해 요청 본문을 Service용 객체로 변환
    const storeData = bodyToStore(req.body);
    
    // Service 호출 및 등록된 가게 정보 받기
    const store = await registerStore(storeData); 
    
    // ⭐ [수정] 통일된 성공 헬퍼 함수 사용 (201 Created)
    res.status(StatusCodes.CREATED).success(store);

  } catch (error) {
    // ⭐ [수정] 오류 발생 시 next(error)로 전역 오류 처리 미들웨어에 전달
    next(error);
  }
};


export const handleListStoreReviews = async (req, res, next) => {
  try {
    // parseInt는 두 번째 인자로 radix를 명시하는 것이 좋습니다.
    const storeId = parseInt(req.params.storeId, 10);
    
    // 1. Query Parameter에서 cursor 값을 안전하게 추출하고 파싱합니다.
    const cursor = (typeof req.query.cursor === "string") 
        ? parseInt(req.query.cursor, 10) 
        : 0; // 커서가 없으면 0부터 시작합니다.

    // 2. Service 호출 시 storeId와 파싱된 cursor 값을 전달합니다.
    const reviews = await listStoreReviews(storeId, cursor); 

    // ⭐ [수정] 통일된 성공 헬퍼 함수 사용 (200 OK)
    res.status(StatusCodes.OK).success(reviews); 

  } catch (error) {
    // ⭐ [수정] 오류 발생 시 next(error)로 전역 오류 처리 미들웨어에 전달
    next(error);
  }
};