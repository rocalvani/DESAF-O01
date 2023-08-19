import { Router } from "express";
import { passportCall } from "../utils.js";
import { userServices } from "../dao/repository/index.js";


const router = Router()

router.get("/", passportCall('jwt'), async (req,res) => {
    let result = await userServices.populated(req.user.email)
    res.status(201).send({status: "success", payload: result.wishlist})
})

router.post("/:pid", passportCall('jwt'), async (req, res) => {
    let user = await userServices.populated(req.user.email)

    let found = user.wishlist.find((el) => el.product == req.params.pid)

    if (!found) {
        let result = await userServices.wishlist(req.user.email, req.params.pid)
        res.status(201).send({status: "success", msg: "This product was added to your wishlist."})
    } else { 
        res.status(401).send({
            status: "error",
            message: "you cannot add productsypu already have added."
          })    }

   })

router.delete("/:pid", passportCall('jwt'), async (req, res) => {
    let result = await userServices.wishlistDel(req.user.email, req.params.pid)
    res.status(201).send(result)
})


export default router