import {messageModel} from "../models/messages.js"

export default class messageService {
    constructor() { 
    }
    
   static async save(el) {
        let result = await messageModel.create(el);
        return result;
    }

    static async getAll() {
        let messages = await messageModel.find();
        return messages.map(el=>el.toObject());
    }
}