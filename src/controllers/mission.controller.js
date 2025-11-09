import { StatusCodes } from "http-status-codes";
import missionService from "../services/mission.service.js";
import missionDto from "../dtos/mission.dto.js";


class missionController {

    // 미션 추가 API - 컨트롤러
    async handleMissionAdd(req, res) {
        console.log("미션 추가를 요청합니다.");
        console.log("body: ", req.body);

        const mission = await missionService.missionAdd(missionDto.bodyToMission(req.body));
        res.status(StatusCodes.OK).json({ result: mission });
        
    };

    // 유저가 도전중인 미션에 추가 API - 컨트롤러
    async hanldeUserMissionAdd(req, res) {
        console.log("유저 미션 추가를 요청합니다.");
        console.log("body: ", req.body);

        
        const userMission = await missionService.userMissionAdd(missionDto.bodyToUserMission(req.body));
        res.status(StatusCodes.OK).json({ result: userMission });
    }
}

export default new missionController();