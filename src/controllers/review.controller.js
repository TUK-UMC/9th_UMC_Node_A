import { StatusCodes } from "http-status-codes";
import reviewService from "../services/review.service.js";
import reviewDto from "../dtos/review.dto.js";


class reviewController {
    // 리뷰 추가 API - 컨트롤러
    async handleReviewAdd (req, res, next) {
        console.log("리뷰 추가를 요청합니다.");
        console.log("body: ", req.body);
        
        const review = await reviewService.reviewAdd(reviewDto.bodyToReview(req.body));
        res.status(StatusCodes.OK).json({ result: review });
    }

    // 리뷰 목록 조회 API - 컨트롤러
    async handleListStoreReviews (req, res, next) {
        const reviews = await reviewService.listStoreReviews(
            req.params.storeId
        );

        res.status(StatusCodes.OK).json(reviews);
    }
}


export default new reviewController();