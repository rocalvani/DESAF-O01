import { userModel } from "../dao/managers/db/models/users.js";
import { generateJWToken } from "../utils.js";
import { validPass } from ".././utils.js";
import { cartService , userService} from "../dao/managers/factory.js";
import { createHash} from ".././utils.js";
import UserDTO from "../dao/dto/user.dto.js";
import { userServices } from "../dao/repository/index.js";

export const logIn = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await userServices.find(email)
      if (!user) {
        return res.status(204).send({ error: "not found" });
      }
  
      if (!validPass) {
        return res.status(401).send({ error: "no coinciden" });
      }
      const tokenUser = {
        name: `${user.name}`,
        email: email,
        age: `${user.age}`,
        admin: `${user.role}`,
      };
      const accessToken = generateJWToken(tokenUser);
  
      // CON COOKIES
      res.cookie("jwtCookieToken", accessToken, {
        maxAge: 1800000,
        httpOnly: true,
      });
      // CREA CART EN LOGIN
      let cart = await cartService.findByUser(user._id);
  
      if (!cart) {
        let result = await cartService.save({ user: user._id });
      }
      res.send({ message: "successful login", user: tokenUser });
    } catch {
      return res.send({ status: "oops! something went wrong on our end." });
    }
  }

  export const signUp = async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
  
    const exists = await userServices.find(email);
    if (exists) {
      return res
        .status(401)
        .send({
          status: "error",
          message: "a user registered under this email already exists",
        });
    }
  
    const user = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
    };
    const result = await userServices.create(user)
    res
      .status(201)
      .send({ status: "success", message: "user has successfully been created" });
  }

  // CURRENT 
  export const current = async (req, res)=>{
    let result = await userServices.censor(req.user.email)
      res.render("profile",{user: result})
  }