import { Router } from "express";
import { userModel } from "../dao/managers/db/models/users.js";
import {authToken} from '../../utils.js'

const router = Router()

// ENDPOINTS 
router.get("/", async(req, res) => {
try {
    let users = await userModel.find()
    res.send(users)
}
catch (err) {
    res.send("error")
}
})

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
        console.error("Error consultando el usuario con ID: " + userId);
    }
})

export default router