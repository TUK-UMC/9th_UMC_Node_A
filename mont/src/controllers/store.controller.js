import { StatusCodes } from "http-status-codes";
import storeService from "../services/store.service.js";
import storeDto from "../dtos/store.dto.js";
import { StoreAlreadyExistsError } from "../error.js";
import errorHandler from "../utils/error.handler.js";

class storeController {

    // 가게 추가 API - 컨트롤러
    async handleStoreAdd (req, res, next) {
        try {
            console.log("가게 추가를 요청합니다.");
            console.log("body: ", req.body);

            const store = await storeService.storeAdd(storeDto.bodyToStore(req.body));
            res.status(StatusCodes.OK).success({result: store});
        } catch (error) {
            const customError = errorHandler.handle(
                error,
                [StoreAlreadyExistsError],
                "STORE_ADD_ERROR",
                "가게 추가 중 오류가 발생했습니다."
            );
            next(customError);
        }
    };
    
    // 가게 리뷰 목록 조회 API - 컨트롤러
    async handleListStoreReviews(req, res, next) {
        try {
            const reviews = await storeService.listStoreReviews(
            parseInt(req.params.storeId), 
            typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
            );
            res.status(StatusCodes.OK).success(reviews);
        } catch (error) {
            error.statusCode = error.statusCode || StatusCodes.BAD_REQUEST;
            error.errorCode = error.errorCode || "STORE_REVIEWS_ERROR";
            error.reason = error.reason || error.message;
            next(error);
        }
    };
}

export default new storeController();