import { StatusCodes } from "http-status-codes";
import storeService from "../services/store.service.js";
import storeDto from "../dtos/store.dto.js";

class storeControll {

    async handleStoreAdd (req, res, next) {
        console.log("가게 추가를 요청합니다.");
        console.log("body: ", req.body);

        const store = await storeService.storeAdd(storeDto.bodyToStore(req.body));
        res.status(StatusCodes.OK).json({ result: store });
    };
    
}

export default new storeControll();