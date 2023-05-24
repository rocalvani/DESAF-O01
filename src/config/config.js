import dotenv from "dotenv";
import program from '../process.js'

const environment = program.opts().mode
dotenv.config({
    path: environment === "prod" ? "./src/config/.env.prod" : "./src/config/.env.dev"
})

export default {
    port: process.env.PORT,
    DB: process.env.db,
    adminName: process.env.ADMIN,
    adminPassword: process.env.ADMIN_PASSWORD
}