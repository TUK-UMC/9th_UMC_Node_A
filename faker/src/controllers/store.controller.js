// src/controllers/store.controller.js

import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { registerStore } from "../services/store.service.js";

import { listStoreReviews } from "../services/store.service.js";

export const handleStoreRegister = async (req, res, next) => {
  try {
    console.log("새로운 가게 등록을 요청했습니다!");
    console.log("body:", req.body);
    
    // DTO를 이용해 요청 본문을 Service용 객체로 변환
    const storeData = bodyToStore(req.body);
    
    // Service 호출 및 등록된 가게 정보 받기
    const store = await registerStore(storeData); 
    
    // 201 Created 상태 코드를 사용
    res.status(StatusCodes.CREATED).json({ 
        message: "가게가 성공적으로 등록되었습니다.",
        result: store 
    });

  } catch (error) {
    // 에러 핸들링
    res.status(StatusCodes.BAD_REQUEST).json({ 
        isSuccess: false,
        code: StatusCodes.BAD_REQUEST,
        message: error.message 
    });
  }
};

// ⭐ Controller 함수: 특정 가게의 리뷰 목록을 조회하는 핸들러
export const handleListStoreReviews = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    
    // ⭐ 1. Query Parameter에서 cursor 값을 안전하게 추출하고 파싱합니다.
    const cursor = (typeof req.query.cursor === "string") 
        ? parseInt(req.query.cursor, 10) 
        : 0; // 커서가 없으면 0부터 시작합니다.

    // ⭐ 2. Service 호출 시 storeId와 파싱된 cursor 값을 전달합니다.
    const reviews = await listStoreReviews(storeId, cursor); 

    // 성공 응답 반환
    res.status(StatusCodes.OK).json(reviews); 

  } catch (error) {
    // 에러 핸들링
    res.status(StatusCodes.BAD_REQUEST).json({ 
        isSuccess: false,
        code: StatusCodes.BAD_REQUEST,
        message: error.message 
    });
  }
};