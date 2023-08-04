import { Router } from "express";
import { userModel } from "../dao/managers/db/models/users.js";
import {authToken,validPass, upload} from '.././utils.js'
import { userServices } from "../dao/repository/index.js";


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
        res.status(201).send(user)
    } catch (error) {
        res.status(500)
    }
})

router.post("/premium/:uid", async(req, res) =>{
    try {
        const user =  await userServices.findByID(req.params.uid)
        const docs = user.documents


        let id = docs.find((el) => el.document.name.includes("id") )
    let address = docs.find((el) => el.document.name.includes("address") )
    let state = docs.find((el) => el.document.name.includes("state") )
      
        if (user.role === "user") {
            if(!id || !address || !state) {
                res.status(401).send({status: "error", msg:"missing information"})
            } else {
                await userServices.upgrade(user._id, "premium")
                res.status(201).send({status: "success", msg: "user updated accordingly."})

            }
        } else {
            await userServices.upgrade(user._id, "user")
            res.status(201).send({status: "success", msg: "user updated accordingly."})

        }
      
      
    } catch (error) {
        res.status(500).send(error)
    }
  })

  router.post("/:uid/edit", upload.single('pfp'),async(req,res) => {
    try {
        let id = {_id: req.params.uid}
      let {first_name, last_name, email, age, gender} = req.body
      let pfp = req.file

      let data = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        age: age,
        gender: gender,
        pfp: pfp.filename
      }

      Object.keys(data).forEach((k) => data[k] == '' && delete data[k]);

      let result = await userServices.updateUser(
        id,data
      );
        res.status(201)
    } catch (error) {
        res.status(500).send(error)
    }
  })

  router.post("/:uid/password", async (req,res) => {
    try {
        const {newPassword, confirmPassword} = req.body
        const id = {_id: req.params.uid}

        const user = userServices.findByID(req.params.uid)
        if (validPass(user, req.body.password)) {
            res.send({
              status: "error",
              msg: "new password cannot be the same as old password",
            });
          }else if (newPassword != confirmPassword) {
            res.status(400).send({msg: "passwords are not matching."})
        } else {
            let result = await userServices.updateUser(
                id,{password: newPassword}
              );
              res.status(201)
        }
    } catch (error) {
        res.status(500).send(error)

    }
  })

  router.post("/user/documents/:uid", upload.array('documents') ,async(req,res) =>{
try {
    const uid = req.params.uid

    let id = req.files.find((el) => el.originalname.toLowerCase().startsWith("id") )
    let address = req.files.find((el) => el.originalname.toLowerCase().startsWith("address") )
    let state = req.files.find((el) => el.originalname.toLowerCase().startsWith("state") )

    if (!id && !address && !state) {
        res.status(401).send({status: "error", msg: "missing info"})
    }

    if (id) {
        await userServices.addDocs(uid, {name: id.filename, reference: id.path})
    }

    if (address) {
        await userServices.addDocs(uid, {name: address.filename, reference: address.path})
    }

    if (state) {
        await userServices.addDocs(uid, {name: state.filename, reference: state.path})
    }

    res.status(201).send({
        id: id,
        address: address,
        state: state
    })
} catch (error) {
    res.status(500).send(error)

}

  } )

export default router