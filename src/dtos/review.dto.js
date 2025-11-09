

class reviewDto {

    // 요청을 리뷰 객체로 변환
    bodyToReview(body) {
        const now = new Date();
        return {
            user_id: body.user_id,
            store_id: body.store_id,
            contents: body.contents,
            score: body.score,
            created_at: now
        };
    }
    // 리뷰 객체를 응답 형태로 변환
    responseFromReview(review) {
        return {
            user_id: review.user_id,
            store_id: review.store_id,
            contents: review.contents,
            score: review.score,
            created_at: review.created_at,
        }
    }
}

export default new reviewDto();

