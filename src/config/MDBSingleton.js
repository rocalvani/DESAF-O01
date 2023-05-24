import mongoose from "mongoose";
import config from './config.js'

export default class MDBSingleton {
    static #instance;
    constructor() {
        this.#connectMongoDB();
    }

    static getInstance() {
        if(this.#instance){
            console.log("A connection already exists.");
        } else {
            this.#instance = new MDBSingleton();
        }
        return this.#instance;
    }

    #connectMongoDB = async () => {
        try {
            await mongoose.connect(config.DB)
            console.log("Successful connection to MongoDB");
        } catch (error) {
            console.error("Unable to connect to MongoDB")
            process.exit()
        }
    }
}