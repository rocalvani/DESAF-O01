import {Router} from 'express';
import { passportCall, authorization, validPass, createHash, expirationJWT, expirationCall } from '.././utils.js';
import { current } from '../controllers/sessions.controller.js';
import nodemailer from "nodemailer";
import config from "../config/config.js";
import { v4 as uuidv4 } from 'uuid';
import { userService } from '../dao/managers/factory.js';
import { userServices } from '../dao/repository/index.js';

const router = Router();

router.get('/login', (req, res)=>{
    res.render("login");
})

router.get('/user',passportCall("jwt"), async(req,res) => {
  let user = await userServices.censor(req.user.email)
  res.send(user)
})

router.get("/",
    passportCall('jwt'), 
    authorization('user'),
    current
)


router.get('/signup', (req, res)=>{
    res.render("signup");
})

router.get("/logout", (req, res) => {
  res.clearCookie("jwtCookieToken").send("borrado");
  });

  router.get('/reset', (req,res) => {
    res.render("recover")
  })

  router.post('/reset', (req,res) => {
    const {email} = req.body

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPassword,
      },
    });

    const recovery = uuidv4()
    const recoveryToken = expirationJWT({token: recovery, user: email})

    res.cookie("recoveryToken", recoveryToken, {
      maxAge: 3600000,
      httpOnly: true,
    });
    
      const mailOptions = {
        from: "uwu" + config.gmailAccount,
        to: email,
        subject: "Reestablecimiento de contraseña",
        html: '<div><h1>seguí para reestablecer</h1> <a href="http://localhost:3000/reset/' + recovery + '">este link</a></div>',
        attachments: [],
      };
    
      let result = transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          req.logger.fatal(`Server error @ ${req.method} ${req.url}` )
          
          CustomError.createError({
            name: "Server error",
            cause: generateServerError(),
            message: "Something went wrong on server end.",
            code: EErrors.DATABASE_ERROR
          })
        }
      });
    res.render("emailSent")
  })

  router.get("/reset/:tk", expirationCall('expiration'), (req,res)=>{
    res.render("reset")
  })

  router.post("/reset/:tk", expirationCall('expiration'), async (req,res) => {
    try {
      const password = createHash(req.body.password)
      const user = await userService.find(req.token.user)

    if (validPass(user, req.body.password)) {
        res.send({status: "error", msg: "new password cannot be the same as old password"})
    } else {
      userService.update(user._id, password)
     res.redirect("/users/login")
    }

    } catch (error) {
      res.send({error: error})
    }
})

export default router;