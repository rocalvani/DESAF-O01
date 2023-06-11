import express from "express";
import { authorization, passportCall } from "../utils.js";
import { renderChat, sendMSG } from "../controllers/chat.controller.js";
import {sendSMS} from '../controllers/sms.controller.js';

const router = express.Router();

// CHAT

router.get("/chat", passportCall('jwt'), authorization('user'), renderChat);
router.post("/chat", sendMSG);

// SMS 
router.get("/", sendSMS);

export default router;
