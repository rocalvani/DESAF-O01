import { Router } from "express";
import { passportCall } from "../utils.js";
import { productServices, userServices } from "../dao/repository/index.js";
const router = Router()

router.post("/:pid", passportCall('jwt'), async (req,res) => {
    try {
        let completeUser = await userServices.find(req.user.email)
        const user = req.user
        const {comment, rating} = req.body
        let date = new Date();


        const data = {user: {name: user.name, email: user.email, id: completeUser._id}, comment: comment, rating: rating, posted: date.toLocaleDateString()}

        let result = await productServices.addComment(req.params.pid, data)

        res.status(201).send({status: "success", msg: "Comment was successfully posted."})
    } catch (error) {
        req.logger.fatal(`Server error @ ${req.method} ${req.url}`)
    }
})

router.delete("/:pid/:id", async (req,res) => {
    try {

        let result = await productServices.deleteComment(req.params.pid, req.params.id)
        res.status(201).send({status: "success", msg: "Comment was successfully deleted."})
    } catch (error) {
        req.logger.fatal(`Server error @ ${req.method} ${req.url}`)
    }
})

export default router