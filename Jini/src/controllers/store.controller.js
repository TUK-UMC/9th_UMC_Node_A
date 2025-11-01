import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { createStore } from "../services/store.service.js";

// 가게 추가 핸들러
export const handleCreateStore = async (req, res, next) => {
    try {
        console.log("가게 추가를 요청했습니다!");
        console.log("body:", req.body);

        // body를 Store DTO로 변환
        const storeData = bodyToStore(req.body);

        // 가게 생성
        const store = await createStore(storeData);

        // 성공 응답
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "가게가 성공적으로 추가되었습니다.",
            result: store,
        });
    } catch (err) {
        console.error("가게 추가 중 오류 발생:", err);
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: err.message,
        });
    }
};
