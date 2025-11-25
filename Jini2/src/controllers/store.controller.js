import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { createStore } from "../services/store.service.js";

export const handleCreateStore = async (req, res, next) => {
    try {
        console.log("가게 추가를 요청했습니다!");
        console.log("body:", req.body);

        const storeData = bodyToStore(req.body);
        const store = await createStore(storeData);

        res.status(StatusCodes.CREATED).success(store);
    } catch (err) {
        next(err);
    }
};
