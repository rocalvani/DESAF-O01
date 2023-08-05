import { Router } from "express";
import { passportCall } from "../utils.js";
import { productServices } from "../dao/repository/index.js";
const router = Router()

router.post("/:pid", passportCall('jwt'), async (req,res) => {
    try {
        const user = req.user
        const comment = req.body.data

        const data = {user: user.name, comment: comment}

        let result = await productServices.addComment(req.params.pid, data)

        res.status(201).send({status: "success", msg: "Comment was successfully posted."})
    } catch (error) {
        req.logger.fatal(`Server error @ ${req.method} ${req.url}`)
    }
})

export default router