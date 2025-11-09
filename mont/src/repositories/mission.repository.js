import { prisma } from "../db.config.js";

class missionRepository {

  // 가게 미션 추가 api - 레포지토리
  async putMission(data) {
    try {
      const mission = await prisma.mission.create({
        data: {
          storeId: BigInt(data.store_id),
          reward: data.reward,
          deadline: data.deadline,
          missionSpec: data.mission_spec,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        }
      });
      return mission.id;
    } catch (error) {
      console.error("Error in putMission:", error);
      throw error;
    }
  } 

  // 유저 미션 추가 api - 레포지토리
  async PutUserMission(data) {
    try {
      const userMission = await prisma.userMission.create({
        data: {
          userId: BigInt(data.user_id),
          missionId: BigInt(data.mission_id),
          status: data.status,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        }
      });
      return userMission.id;
    } catch (error) {
      console.error("Error in PutUserMission:", error);
      throw error;
    }
  }    

  // 미션 테이블에서 mission 아이디로 미션 조회
  async findMissionById(mission_id) {
    const mission = await prisma.mission.findFirst({
      where: { id: BigInt(mission_id) }
    });
    return mission;
  }

  // 유저 미션 테이블에서 mission 아이디로 유저 미션 조회
  async findUserMissionByMissionId(mission_id) {
    const userMission = await prisma.userMission.findFirst({
      where: { missionId: BigInt(mission_id) }
    });
    return userMission;
  }
}

export default new missionRepository();