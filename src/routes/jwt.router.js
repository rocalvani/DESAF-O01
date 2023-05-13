import { Router } from "express";
import { createHash, generateJWToken } from "../../utils.js";
import { validPass } from "../../utils.js";
import { userModel } from "../dao/managers/db/models/users.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
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
      maxAge: 100000,
      httpOnly: false,
    });
    res.send({ message: "successful login" });
  } catch {
    return res.send({ status: "oops! something went wrong on our end." });
  }
});

router.post('/signup', async (req,res) => {
  const {first_name, last_name, email, age, password} = req.body

  const exists = await userModel.findOne({email: req.body.email})
  if (exists) {
    return res.status(401).send({status: "error", message: "a user registered under this email already exists"});
  }

  const user = {
    first_name,
    last_name,
    email,
    age,
    password: createHash(password)
  }
  const result = await userModel.create(user)
  res.status(201).send({status: "success", message: "user has successfully been created"})
})

export default router;
