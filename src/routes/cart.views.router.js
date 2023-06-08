import { Router } from "express";
import nodemailer from 'nodemailer';
import config from '../config/config.js';
import { getCart } from "../controllers/carts.controller.js";

const router = Router();

router.get("/:cid", getCart);

// MAILING //

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPassword
    }
  });
  
  const mailOptions = {
    from: "Coder Test " + config.gmailAccount,
    to: config.gmailAccount,
    subject: "Correo de prueba Coderhouse Programacion Backend clase 30.",
    html: `<div><h1>Esto es un Test de envio de correos con Nodemailer!</h1></div>`,
    attachments: []
  }
  
  router.get("/:cid/purchase", async(req,res) =>{
    try {
      let result = transporter.sendMail(mailOptions, (error, info) =>{
        if (error) {
          res.status(400).send({msg: "Error", payload: error})
        }
        res.send({msg: "Success", payload: info})
      })
    } catch (error) {
      res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
      
    }
  })

export default router