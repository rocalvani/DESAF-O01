import { ticketModel } from "../models/ticket";

export default class ticketService {
    constructor() {
        console.log("ticket service working with mongodb.")
    }

    static async saveTicket(el) {
        let result = await ticketModel.create(el);
        return result;
    }

    static async getTicket(id) {
        let result = await ticketModel.findById(id)
        return result;
    }
}