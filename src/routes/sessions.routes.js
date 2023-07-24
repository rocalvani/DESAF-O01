import { Router } from 'express';
import {authorization, generateJWToken} from '.././utils.js';
import passport from 'passport';
import { passportCall } from '.././utils.js';
import { current } from '../controllers/sessions.controller.js';

const router = Router();

// AUTENTICACION GITHUB

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {
    const token = generateJWToken(req.session.user)
     // CON COOKIES
     res.cookie("jwtCookieToken", token, {
        maxAge: 60000,
        httpOnly: false,
      });
      res.status(201).send({status: "successful login", token: token });
})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async(req,res)=> {
    req.session.user = req.user;
    const token = generateJWToken(req.session.user)
     // CON COOKIES
     res.cookie("jwtCookieToken", token, {
        maxAge: 1800000,
        httpOnly: false,
      });
    res.status(201).redirect('/api/sessions/current')
})

router.get('/current', passportCall('jwt'), authorization('user'), current)

export default router;