import {Router} from 'express';
import { authToken } from '.././utils.js';
import { passportCall, authorization } from '.././utils.js';
const router = Router();

router.get('/login', (req, res)=>{
    res.render("login");
})

router.get("/",
    // authToken,
    passportCall('jwt'), //-> Usando JWT por Cookie usando customCall
    authorization('user'),
    (req, res)=>{
        res.render("profile",{user: req.user})
    }
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
  
  function auth(req,res,next){
  if (!req.session.admin) {
  return next()
  } else {
    return res.status(403).send("este usuario no está autorizado")
  }
  }
  
  router.get("/priv", auth, (req, res) => {
    res.send("Welcome to a site only visible for admins")
  });

export default router;