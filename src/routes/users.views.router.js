import { Router } from "express";
import {
  passportCall,
  authorization,
  validPass,
  createHash,
  expirationJWT,
  expirationCall,
} from ".././utils.js";
import { current } from "../controllers/sessions.controller.js";
import nodemailer from "nodemailer";
import config from "../config/config.js";
import { v4 as uuidv4 } from "uuid";
import { userService } from "../dao/managers/factory.js";
import { userServices } from "../dao/repository/index.js";
import ticketService from "../dao/managers/db/services/ticket.service.js";

const router = Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/user/:uid", passportCall("jwt"), async (req, res) => {
  let user = await userServices.censor(req.user.email);
  let tickets = await ticketService.getTicketByEmail(req.user.email)
  res.send({ user: user, role: req.user.role, tickets: tickets});
});

router.get("/online", passportCall("jwt"), async (req, res) => {
  res.send({ user: req.user });
});

router.get("/", passportCall("jwt"), authorization("user"), current);

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/logout", passportCall("jwt"), async (req, res) => {
  const user = await userServices.find(req.user.email)

    // UPDATE DE LAST CONNECTION // 
    let last_connection = new Date();
    await userServices.updateUser({_id: user._id}, { last_connection: last_connection.toDateString()}); 
  res.status(201).clearCookie("jwtCookieToken").send("borrado");
});

router.get("/reset", (req, res) => {
  res.render("recover");
});

router.post("/reset", async (req, res) => {
  try {
    const { email } = req.body;

  let user = await userServices.find(email)

  if (user) { 
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPassword,
      },
    });
  
    const recovery = uuidv4();
    const recoveryToken = expirationJWT({ token: recovery, user: email });
  
    res.cookie("recoveryToken", recoveryToken, {
      maxAge: 3600000,
      httpOnly: true,
    });
  
    const mailOptions = {
      from: "uwu" + config.gmailAccount,
      to: email,
      subject: "Reestablecimiento de contraseña",
      html: `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Reseteo de contraseña</title>
            </head>
            <body>
              <center>
                <table width="750">
                  <tr>
                    <td width="750" colspan="3">
                      <img src="" alt="" style="width: 750px; height: 250px" />
                    </td>
                  </tr>
                  <tr width="750" colspan="3" height="50">
                    <td></td>
                  </tr>
                  <tr>
                    <td width="50"></td>
                    <td width="650" style="text-align: center; font-family: Arial, Helvetica, sans-serif; font-size: 15pt;">
          
                      <p>٩(⁎❛ᴗ❛⁎)۶ </p>
                      <p> Recibimos tu pedido de reseteo de contraseña y estamos acá para dejarte el link a tu salvación.</p>
          
                    </td>
                    <td width="50"></td>
                  </tr>
                  <tr>
                    <td width="750" colspan="3" height="50"></td>
                  </tr>
                  <tr>
                      <td width="750" colspan="3"><a href="http://localhost:3000/reset/'${recovery}">
                          <img src="" alt="" style="width: 750px; height: 50px" /></a>
                      </td>
                    </tr>
                    <tr>
                      <td width="750" colspan="3" height="20"></td>
                    </tr>
                    <tr>
                      <td width="50"></td>
                      <td width="650" style="text-align: center; font-family: Arial, Helvetica, sans-serif; font-size: 15pt;">
            
                        <p>Recordá que este link es válido por una hora desde el momento de recibido este mail.</p>
                        <p>✧ &#9825; ✧</p>
                        
                      </td>
                      <td width="50"></td>
                    </tr>
                    <tr>
                      <td width="750" colspan="3" height="20"></td>
                    </tr>
                  <tr>
                    <td width="750" colspan="3">
                      <img src="" alt="" style="width: 750px; height: 50px" />
                    </td>
                  </tr>
                </table>
              </center>
            </body>
          </html>`,
      attachments: [],
    };
  
    let result = transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        req.logger.fatal(`Server error @ ${req.method} ${req.url}`);
  
        CustomError.createError({
          name: "Server error",
          cause: generateServerError(),
          message: "Something went wrong on server end.",
          code: EErrors.DATABASE_ERROR,
        });
      }
    });
    res.status(201).send("enviado")
  } else {
    res.status(404).send("there is no user under this email")
  }
 
   
  } catch (error) {
    res.status(500).send("error")
  }

  
});

router.get("/reset/:tk", expirationCall("expiration"), (req, res) => {
  res.render("reset");
});

router.post("/reset/:tk", expirationCall("expiration"), async (req, res) => {
  try {
    const password = createHash(req.body.password);
    const user = await userServices.find(req.token.user);
    if (validPass(user, req.body.password)) {
      res.send({
        status: "error",
        msg: "new password cannot be the same as old password",
      });
    } else {
      let result= await userServices.updateUser({_id: user._id}, { password: password }); 
      res.status(201).send("success")
    }
  } catch (error) {
    res.send({ error: error });
  }
});

export default router;
