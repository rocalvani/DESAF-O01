import UserDTO from "../dto/user.dto.js";

export default class userRepository {
  constructor(dao) {
    this.dao = dao;
  }

  find = async (el) => { 
    let result = this.dao.find(el);
    return result;
  };

  findByID = async (el) => { 
    let result = this.dao.findByID(el);
    return result;
  };

  create = async (el) => {
    let result = this.dao.create(el);
    return result;
  };

  updateUser = async (id, data) => {
    let result = this.dao.update(id, data);
    return result;
  };

  censor = async (el) => {
    let result = await this.dao.find(el);
    let dto = new UserDTO(result);
    return dto;
  };

  upgrade = async (id,data) => {
    let result = this.dao.upgrade(id, data);
    return result;
  }
  
  addDocs = async(id,data) => {
    let result = this.dao.addDocs(id, data);
    return result;
  }
}
