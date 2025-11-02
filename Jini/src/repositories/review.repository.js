import { prisma } from "../db/prisma.js";

// 리뷰 추가
export const addReview = async (data) => {
    try {
        const review = await prisma.review.create({
            data: {
                storeId: data.storeId,
                userId: data.userId,
                rating: data.rating,
                content: data.content,
            }
        });

        return review.reviewId;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};

// 리뷰 이미지 추가
export const addReviewImage = async (reviewId, imageUrl) => {
    try {
        const reviewImage = await prisma.reviewImage.create({
            data: {
                reviewId: reviewId,
                imageUrl: imageUrl,
            }
        });

        return reviewImage.id;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};

// 리뷰 정보 조회
export const getReview = async (reviewId) => {
    try {
        const review = await prisma.review.findUnique({
            where: { reviewId: parseInt(reviewId) }
        });

        if (!review) {
            return null;
        }

        return review;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};

// 리뷰 이미지 목록 조회
export const getReviewImages = async (reviewId) => {
    try {
        const images = await prisma.reviewImage.findMany({
            where: { reviewId: parseInt(reviewId) },
            orderBy: { createdAt: 'asc' }
        });

        return images;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};
