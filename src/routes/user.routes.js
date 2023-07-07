import { Router } from "express";
import { userModel } from "../dao/managers/db/models/users.js";
import {authToken} from '.././utils.js'
import { userService } from '../dao/managers/factory.js';

const router = Router()

// ENDPOINTS 
router.post("/", authToken, async (req,res) => {
try {
    let {firstName, lastName, email} = req.body;
    let user = await userModel.create({firstName, lastName, email})
    res.status(201).send(user)
} catch (error) {
    res.send("error")
}
})

router.put("/:id", async (req, res) =>{
    const userId = req.params.userId;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            res.status(202).json({message: "User not found with ID: " + userId});
        }
        res.json(user);
    } catch (error) {
        req.logger.fatal(`Server error @ ${req.method} ${req.url}` )    }
})

router.get ('/:id', async(req,res)=>{
    try {
        const user = await userModel.findById(req.params.id)
        res.send(user)
    } catch (error) {
        
    }
})

router.post("/premium/:uid", async(req, res) =>{
    const user =  await userService.findByID(req.params.uid)
  
    if (user.role === "user") {
        await userService.upgrade(user._id, "premium")
    } else {
        await userService.upgrade(user._id, "user")
    }
  
    res.send({status: "success", msg: "user updated accordingly."})
  
  })
export default router