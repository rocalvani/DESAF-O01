import {userModel} from '../models/users.js'

export default class userService {
    constructor() {
        console.log("user service working with mongodb.")
    }

    static async find(el) {
        let result = await userModel.findOne({email: el});
        return result;

    }

    static async create(el) {
        let result = await userModel.create(el);
        return result;
    }

}