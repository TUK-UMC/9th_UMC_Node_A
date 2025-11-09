import { StatusCodes } from "http-status-codes";
import storeService from "../services/store.service.js";
import storeDto from "../dtos/store.dto.js";

class storeController {

    // 가게 추가 API - 컨트롤러
    async handleStoreAdd (req, res, next) {
        console.log("가게 추가를 요청합니다.");
        console.log("body: ", req.body);

        const store = await storeService.storeAdd(storeDto.bodyToStore(req.body));
        res.status(StatusCodes.OK).json({ result: store });
    };
    
    // 가게 리뷰 목록 조회 API - 컨트롤러
    async handleListStoreReviews(req, res, next) {
        const reviews = await storeService.listStoreReviews(
        parseInt(req.params.storeId), 
        typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
        );
        res.status(StatusCodes.OK).json(reviews);
    };
}

export default new storeController();