import { StatusCodes } from "http-status-codes";
import storeService from "../services/store.service.js";
import storeDto from "../dtos/store.dto.js";
import { StoreAlreadyExistsError } from "../error.js";

class storeController {

    // 가게 추가 API - 컨트롤러
    async handleStoreAdd (req, res, next) {
        try {
            console.log("가게 추가를 요청합니다.");
            console.log("body: ", req.body);

            const store = await storeService.storeAdd(storeDto.bodyToStore(req.body));
            res.status(StatusCodes.OK).json({ result: store });
        } catch (error) {
            // 커스텀 에러인 경우 그대로 전달, 아니면 기본 에러 형식으로 변환
            if (error instanceof StoreAlreadyExistsError) {
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
                    errorCode: "STORE_ADD_ERROR",
                    reason: error.message || "가게 추가 중 오류가 발생했습니다.",
                    data: null
                };
                next(customError);
            }
        }
    };
    
    // 가게 리뷰 목록 조회 API - 컨트롤러
    async handleListStoreReviews(req, res, next) {
        try {
            const reviews = await storeService.listStoreReviews(
            parseInt(req.params.storeId), 
            typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
            );
            res.status(StatusCodes.OK).json(reviews);
        } catch (error) {
            error.statusCode = error.statusCode || StatusCodes.BAD_REQUEST;
            error.errorCode = error.errorCode || "STORE_REVIEWS_ERROR";
            error.reason = error.reason || error.message;
            next(error);
        }
    };
}

export default new storeController();