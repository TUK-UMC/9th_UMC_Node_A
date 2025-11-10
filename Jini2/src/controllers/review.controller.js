import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { createReview } from "../services/review.service.js";
import { BadRequestError } from "../errors.js";

// 리뷰 추가 핸들러
export const handleCreateReview = async (req, res, next) => {
    try {
        console.log("리뷰 추가를 요청했습니다!");
        console.log("params:", req.params);
        console.log("body:", req.body);

        const storeId = parseInt(req.params.storeId);
        const userId = req.body.userId;

        if (!userId) {
            throw new BadRequestError("userId는 필수입니다.", req.body);
        }

        const reviewData = bodyToReview(req.body, storeId, userId);
        const review = await createReview(reviewData);

        res.status(StatusCodes.CREATED).success(review);
    } catch (err) {
        next(err);
    }
};