import userDto from "../dtos/user.dto.js";
import userRepo from "../repositories/user.repository.js";
import { DuplicateUserEmailError } from "../error.js";

class userService {

  async userSignUp(data) {
    const joinUserId = await userRepo.addUser({
      email: data.email,
      name: data.name,
      gender: data.gender,
      birth: data.birth,
      address: data.address,
      detailAddress: data.detailAddress,
      phoneNumber: data.phoneNumber,
    });

    if (!joinUserId) {
      throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
    }

    // userRepo.addUser가 id만 반환하므로 joinUserId 사용
    for (const preference of data.preferences) {
      await userRepo.setPreference(joinUserId, preference); // userId 직접 전달
    }

    const preferences = await userRepo.getUserPreferencesByUserId(joinUserId);
    const joinUser = await userRepo.getUser(joinUserId);    // 유저 객체 받기

    return userDto.responseFromUser(joinUser, preferences); // 유저 객체(ID 아님)와 선호 카테고리 전달
  }

  async updateProfile(userId, data) {
    const updatedUser = await userRepo.updateUser(userId, {
      name: data.name,
      gender: data.gender,
      birth: data.birth ? new Date(data.birth) : undefined,
      address: data.address,
      detailAddress: data.detailAddress,
      phoneNumber: data.phoneNumber,
    });

    return updatedUser;
  }
}

export default new userService();
