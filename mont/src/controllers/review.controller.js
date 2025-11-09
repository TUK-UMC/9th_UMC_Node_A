import { StatusCodes } from "http-status-codes";
import reviewService from "../services/review.service.js";
import reviewDto from "../dtos/review.dto.js";
import { StoreNotFoundError } from "../error.js";


class reviewController {
    // 리뷰 추가 API - 컨트롤러
    async handleReviewAdd (req, res, next) {
        try {
            console.log("리뷰 추가를 요청합니다.");
            console.log("body: ", req.body);
            
            const review = await reviewService.reviewAdd(reviewDto.bodyToReview(req.body));
            res.status(StatusCodes.OK).json({ result: review });
        } catch (error) {
            // 커스텀 에러인 경우 그대로 전달, 아니면 기본 에러 형식으로 변환
            if (error instanceof StoreNotFoundError) {
                const customError = {
                    statusCode: StatusCodes.BAD_REQUEST,
                    errorCode: error.errorCode,
                    reason: error.reason,
                    data: error.data
                };
                next(customError);
            } else {
                // 일반 에러인 경우
                const customError = {
                    statusCode: StatusCodes.BAD_REQUEST,
                    errorCode: "REVIEW_ADD_ERROR",
                    reason: error.message || "리뷰 추가 중 오류가 발생했습니다.",
                    data: null
                };
                next(customError);
            }
        }
    }

    // 리뷰 목록 조회 API - 컨트롤러
    async handleListStoreReviews (req, res, next) {
        try {
            const reviews = await reviewService.listStoreReviews(
                req.params.storeId
            );

            res.status(StatusCodes.OK).json(reviews);
        } catch (error) {
            error.statusCode = error.statusCode || StatusCodes.BAD_REQUEST;
            error.errorCode = error.errorCode || "REVIEW_LIST_ERROR";
            error.reason = error.reason || error.message;
            next(error);
        }
    }
}


export default new reviewController();