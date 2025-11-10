// src/controllers/review.controller.js

import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { registerReview } from "../services/review.service.js";

// 리뷰 등록 핸들러
export const handleReviewRegister = async (req, res, next) => {
  try {
    // 1. Path Parameter에서 storeId 획득 (숫자형으로 변환)
    const storeId = parseInt(req.params.storeId, 10);
    
    console.log(`가게 ID ${storeId}에 리뷰 등록을 요청했습니다!`);
    console.log("body:", req.body);
    
    // 2. DTO를 이용해 요청 본문을 Service용 객체로 변환
    const reviewData = bodyToReview(req.body);
    
    // 3. Service 호출 및 등록된 리뷰 정보 받기
    const review = await registerReview(storeId, reviewData); 
    
    res.status(StatusCodes.CREATED).json({ 
        message: "리뷰가 성공적으로 등록되었습니다.",
        result: review 
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