import {
    addReview,
    addReviewImage,
    getReview,
    getReviewImages,
} from "../repositories/review.repository.js";
import { isStoreExists } from "../repositories/store.repository.js";
import { reviewToResponse } from "../dtos/review.dto.js";
import { NotFoundError } from "../errors.js";

// 리뷰 추가
export const createReview = async (data) => {
    // 가게 존재 여부 확인
    const storeExists = await isStoreExists(data.storeId);
    if (!storeExists) {
        throw new NotFoundError("존재하지 않는 가게입니다.", { storeId: data.storeId });
    }

    // 리뷰 추가
    const reviewId = await addReview(data);

    // 리뷰 이미지 추가
    if (data.imageUrls && data.imageUrls.length > 0) {
        for (const imageUrl of data.imageUrls) {
            await addReviewImage(reviewId, imageUrl);
        }
    }

    // 추가된 리뷰 정보 조회
    const review = await getReview(reviewId);
    const images = await getReviewImages(reviewId);

    // 응답 DTO로 변환하여 반환
    return reviewToResponse(review, images);
};
