import { prisma } from "../db.config.js";

class reviewRepository {
  // 리뷰 추가 api - 레포지토리
  async putReview(data) {
    try {
      const review = await prisma.review.create({
        data: {
          userId: BigInt(data.user_id),
          storeId: BigInt(data.store_id),
          body: data.contents,
          score: data.score,
          createdAt: data.created_at
        }
      });
      return review.id; // 삽입된 리뷰의 ID 반환
    } catch (error) {
      console.error("Error in putReview:", error);
      throw error;
    } 
  }
}

export default new reviewRepository();
