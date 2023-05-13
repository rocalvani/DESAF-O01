import { Router } from 'express';
import {userModel} from '../dao/managers/db/models/users.js';

import { createHash, generateJWToken, validPass } from '../../utils.js';
import passport from 'passport';
import { passportCall } from '../../utils.js';

const router = Router();

// router.post("/signup", async (req, res)=>{
//     const { name, last, email, age, password, admin} = req.body;
    
//     const exists = await userModel.findOne({email});
//     if (exists){
//         return res.status(400).send({status: "error", message: "We already have one under that email."});
//     }
//     const user = {
//         name,
//         last,
//         email,
//         age,
//         password: createHash(password),
//         admin
//     };
//     const result = await userModel.create(user);
//     res.status(201).send({status: "success", message: "new user created with id: " + result.id});
// }); 

// router.post('/signup', passport.authenticate('register', {failureRedirect: '/api/sessions/fail-register'}),
// async(req,res) => {
//     const token = generateJWToken(req.session.user)
//     res.status(201).send({status: "success"})
// })

// router.post("/login", async (req, res)=>{
//     const {email, password} = req.body;
//     const user = await userModel.findOne({email});
//     if(!user) return res.status(401).send({status:"error",error:"Incorrect credentials."});
   
//    if (!validPass(user,password)) {
//     return res.status(401).send({status:"error",error:"Incorrect credentials."});
//    }
   
//     req.session.user = {
//         name : `${user.name} ${user.last}`,
//         email: user.email,
//         age: user.age, 
//         admin: user.admin
//     }
//     res.send({status:"success", payload:req.session.user, message:"Welcome to our site!" });
//     res.render("products")
// });

// router.post("/login", passport.authenticate('login', { failureRedirect: '/api/sessions/fail-login' }), async (req, res) => {
//     const user = req.user;
//     if (!user) return res.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
//     req.session.user = {
//         name: user.name,
//         email: user.email,
//         age: user.age
//     }
//     const token = generateJWToken(user)
//     res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo realizado! :)", token: token });
// });

// router.get("/fail-login", (req,res) => {
//     res.status(401).send({error: "error"})
// })

// AUTENTICACION GITHUB

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {
    const token = generateJWToken(req.session.user)
     // CON COOKIES
     res.cookie("jwtCookieToken", token, {
        maxAge: 60000,
        httpOnly: false,
      });
      res.send({ message: "successful login" });
})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async(req,res)=> {
    req.session.user = req.user;
    const token = generateJWToken(req.session.user)
     // CON COOKIES
     res.cookie("jwtCookieToken", token, {
        maxAge: 60000,
        httpOnly: false,
      });
    res.redirect('/products')
})

router.get('/current', passportCall('jwt'),
(req, res)=>{
    res.render("profile",{user: req.user})
})

export default router;