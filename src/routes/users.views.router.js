import {Router} from 'express';
import { authToken } from '.././utils.js';
import { passportCall, authorization } from '.././utils.js';
import { userService } from '../dao/managers/factory.js';
import UserDTO from '../dao/dto/user.dto.js';
import { current } from '../controllers/sessions.controller.js';

const router = Router();

router.get('/login', (req, res)=>{
    res.render("login");
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
    req.session.destroy(err  => {
      if (err) {
        res.json({error: "error de logout"})
      }
      res.render("login")
    })
  });
  

export default router;