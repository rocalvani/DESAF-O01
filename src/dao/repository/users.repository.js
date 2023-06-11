import UserDTO from "../dto/user.dto.js";

export default class userRepository {
  constructor(dao) {
    this.dao = dao;
  }

  find = async (el) => {
    let result = this.dao.find(el);
    return result;
  };

  create = async (el) => {
    let result = this.dao.create(el);
    return result;
  };

  censor = async (el) => {
    let result = await this.dao.find(el);
    let dto = new UserDTO(result);
    return dto;
  };
}
