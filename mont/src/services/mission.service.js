import missionDto from "../dtos/mission.dto.js";
import missionRepo from "../repositories/mission.repository.js";
import storeRepo from "../repositories/store.repository.js";    // 가게 검색을 위한 레포지토리 임포트
import { StoreNotFoundError, MissionNotFoundError, MissionAlreadyOngoingError, MissionAlreadyCompletedError } from "../error.js";

class missionService {

  // 미션 추가 API - 서비스
  async missionAdd(data) {
    const store = await storeRepo.findStoreById(data.store_id); // store_id로 가게 존재 여부 확인
    if (!store) {
      throw new StoreNotFoundError("존재하지 않는 가게입니다.", data);
  }

  // 가게가 존재하면 미션 추가
  await missionRepo.putMission({
      store_id: data.store_id,
      reward: data.reward,
      deadline: data.deadline,
      mission_spec: data.mission_spec,
      created_at: data.created_at,
      updated_at: data.updated_at,
  });

  return missionDto.responseFromMission(data);
  }

  // 유저가 도전중인 미션에 추가 API - 서비스
  async userMissionAdd(data) {
    const mission = await missionRepo.findMissionById(data.mission_id); // 미션 테이블에 존재하는 미션인지 확인
    const userMission = await missionRepo.findUserMissionByMissionId(data.mission_id);  // 이미 도전중이거나 수행한 미션인지 확인

    if(!mission) {
      throw new MissionNotFoundError("존재하지 않는 미션입니다.", data);
    }
  
    if (userMission) {
      if(userMission.status == "ongoing") {
        throw new MissionAlreadyOngoingError("이미 도전중인 미션입니다.", data);
      }
      if(userMission.status == "completed") {
        throw new MissionAlreadyCompletedError("이미 완료한 미션입니다.", data);
      }
    }
    
    // 미션이 존재하고 도전중이거나 수행한 미션이 아니면 유저 미션 추가
    await missionRepo.PutUserMission({
      user_id: data.user_id,
      mission_id: data.mission_id,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
    });

    return missionDto.responseFromUserMission(data);
  }
}


export default new missionService();
