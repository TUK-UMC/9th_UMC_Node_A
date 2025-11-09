import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { createReview } from "../services/review.service.js";

// 리뷰 추가 핸들러
export const handleCreateReview = async (req, res, next) => {
    try {
        console.log("리뷰 추가를 요청했습니다!");
        console.log("params:", req.params);
        console.log("body:", req.body);

        const storeId = parseInt(req.params.storeId);
        const userId = req.body.userId; // 실제로는 인증 미들웨어에서 가져와야 함

        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "userId는 필수입니다.",
            });
        }

        // body를 Review DTO로 변환
        const reviewData = bodyToReview(req.body, storeId, userId);

        // 리뷰 생성
        const review = await createReview(reviewData);

        // 성공 응답
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "리뷰가 성공적으로 추가되었습니다.",
            result: review,
        });
    } catch (err) {
        console.error("리뷰 추가 중 오류 발생:", err);
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: err.message,
        });
        next(err)
    }
};
