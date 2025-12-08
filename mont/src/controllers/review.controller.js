import { StatusCodes } from "http-status-codes";
import reviewService from "../services/review.service.js";
import reviewDto from "../dtos/review.dto.js";
import { StoreNotFoundError } from "../error.js";
import errorHandler from "../utils/error.handler.js";


class reviewController {
    // 리뷰 추가 API - 컨트롤러
    async handleReviewAdd (req, res, next) {
        try {
            console.log("리뷰 추가를 요청합니다.");
            console.log("body: ", req.body);
            console.log("user: ", req.user);
            
            // 인증된 사용자의 ID를 사용
            const reviewData = {
                ...req.body,
                userId: req.user.id
            };
            
            const review = await reviewService.reviewAdd(reviewDto.bodyToReview(reviewData));
            res.status(StatusCodes.OK).success({ result: review });
        } catch (error) {
            const customError = errorHandler.handle(
                error,
                [StoreNotFoundError],
                "REVIEW_ADD_ERROR",
                "리뷰 추가 중 오류가 발생했습니다."
            );
            next(customError);
        }
    }

    // 리뷰 목록 조회 API - 컨트롤러
    async handleListStoreReviews (req, res, next) {
        try {
            const reviews = await reviewService.listStoreReviews(
                req.params.storeId
            );

            res.status(StatusCodes.OK).success(reviews);
        } catch (error) {
            error.statusCode = error.statusCode || StatusCodes.BAD_REQUEST;
            error.errorCode = error.errorCode || "REVIEW_LIST_ERROR";
            error.reason = error.reason || error.message;
            next(error);
        }
    }
}


export default new reviewController();