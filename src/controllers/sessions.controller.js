import { userModel } from "../dao/managers/db/models/users.js";
import { generateJWToken } from "../utils.js";
import { validPass } from ".././utils.js";
import { cartService} from "../dao/managers/factory.js";
import { createHash} from ".././utils.js";
import UserDTO from "../dao/dto/user.dto.js";
import { userServices } from "../dao/repository/index.js";
import CustomError from "../errors/CustomError.js";
import { generateDuplicateErrorInfo, generateLogInErrorInfo, generateUserErrorInfo } from "../errors/messages/userCreationError.message.js";
import EErrors from "../errors/enums.js";

export const logIn = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await userServices.find(email)
      if (!user) {
        CustomError.createError({
          name: "user logging error",
          cause: generateLogInErrorInfo(),
          message: "User does not exist.",
          code: EErrors.NOT_FOUND
        })
       }
  
      if (!validPass) {
        if (!user) {
          CustomError.createError({
            name: "user logging error",
            cause: generateUserErrorInfo(),
            message: "User does not exist.",
            code: EErrors.INVALID_TYPES_ERROR
          })
         }
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
      CustomError.createError({
        name: "Server error",
        cause: generateServerError(),
        message: "Something went wrong on server end.",
        code: EErrors.DATABASE_ERROR
      })
    }
  }

  export const signUp = async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
  
 if (!password || !email) {
  CustomError.createError({
    name: "user creation error",
    cause: generateUserErrorInfo({first_name, last_name, email}),
    message: "User could not be created.",
    code: EErrors.INVALID_TYPES_ERROR
  })
 }

    const exists = await userServices.find(email);
    if (exists) {
      return CustomError.createError({
          name: "user creation error",
          cause: generateDuplicateErrorInfo(),
          message: "User already exists.",
          code: EErrors.INVALID_TYPES_ERROR
        })
       
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