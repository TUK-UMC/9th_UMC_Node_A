// Review DTO 변환 함수들

// 요청 body를 Review 엔티티로 변환
export const bodyToReview = (body, storeId, userId) => {
    return {
        storeId,
        userId,
        rating: body.rating,
        content: body.content || "",
        imageUrls: body.imageUrls || body.image_urls || [],
    };
};

// Review 엔티티를 응답 DTO로 변환
export const reviewToResponse = (review, images = []) => {
    return {
        reviewId: review.review_id,
        storeId: review.store_id,
        userId: review.user_id,
        rating: review.rating,
        content: review.content,
        images: images.map(img => ({
            imageId: img.image_id,
            imageUrl: img.image_url,
            createdAt: img.created_at,
        })),
        createdAt: review.created_at,
    };
};
