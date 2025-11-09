import reviewRepo from "../repositories/review.repository.js";
import reviewDto from "../dtos/review.dto.js";
import storeRepo from  "../repositories/store.repository.js";   // 가게 조회를 위한 임포트

class reviewService {
    // 리뷰 추가 API - 서비스
    async reviewAdd(data) {

        // 먼저 store 존재 여부 확인
        const storeExists = await storeRepo.findStoreById(data.store_id);

        if (!storeExists) {
            // 존재하지 않으면 에러 발생
            throw new Error("존재하지 않는 가게입니다.");
        }

            // 가게가 존재하면 리뷰 추가
        const joinReview = await reviewRepo.putReview({
            user_id: data.user_id,
            store_id: data.store_id,
            contents: data.contents,
            score: data.score,
            created_at: data.created_at
        });

        return reviewDto.responseFromReview(data);   
    }

    // 가게 리뷰 목록 조회 - 서비스
    async listStoreReviews(storeId) {
        const reviews = await getAllStoreReviews(storeId);
        return reviewDto.responseFromReview(reviews);
    }
    // 리뷰 정보 얻어오기
    async getReview(storeId, query) {
        return reviewDto.previewerReviewDTO(await getPreviewReview(reviewId, serializeJsonQuery, storeId));
    }

    
}

export default new reviewService();
