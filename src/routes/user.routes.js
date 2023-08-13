import { Router } from "express";
import { userModel } from "../dao/managers/db/models/users.js";
import {
  authToken,
  validPass,
  upload,
  passportCall,
  authorization,
} from ".././utils.js";
import { userServices } from "../dao/repository/index.js";
import { mailOptions, transporter } from "../mailing.js";

const router = Router();

// ENDPOINTS

router.get("/", async (req, res) => {
  try {
    let result = await userServices.getAll();
    let censured = await userServices.censorMany(result);
    res.send(censured);
  } catch (error) {
    req.logger.fatal(`Server error @ ${req.method} ${req.url}`);
  }
});

router.delete(
  "/",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    try {
      let users = await userServices.getAll();
      let toDelete = [];
      let ms = 1000 * 60 * 60 * 24;

      
      let lastConnection = users.forEach((el) => {
        let date = Date.now() - Date.parse(el.last_connection);
        let difference = Math.floor(date / ms);
        if (difference > 2) {
          toDelete.push(el);
        }
      });
      let result = toDelete.forEach(async (el) => {
        let options = mailOptions("Su cuenta ha sido desactivada debido a un periodo de inactividad prolongada", "Aviso por inactividad", el.email, [] )
        transporter.sendMail(options, (error, info) => {
            if (error) {
              req.logger.fatal(`Server error @ ${req.method} ${req.url}`);
        
              CustomError.createError({
                name: "Server error",
                cause: generateServerError(),
                message: "Something went wrong on server end.",
                code: EErrors.DATABASE_ERROR,
              });
            }
          });
        await userServices.delete(el._id);
      });

      res.status(201).send({
        status: "success",
        msg: "all inactive users have been cleared.",
      });
    } catch (error) {
      req.logger.fatal(`Server error @ ${req.method} ${req.url}`);
    }
  }
);

router.post("/", authToken, async (req, res) => {
  try {
    let { firstName, lastName, email } = req.body;
    let user = await userModel.create({ firstName, lastName, email });
    res.status(201).send(user);
  } catch (error) {
    res.send("error");
  }
});

router.put("/:id", async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(202).json({ message: "User not found with ID: " + userId });
    }
    res.json(user);
  } catch (error) {
    req.logger.fatal(`Server error @ ${req.method} ${req.url}`);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    res.status(201).send(user);
  } catch (error) {
    res.status(500);
  }
});

router.post("/premium/:uid", async (req, res) => {
  try {
    const user = await userServices.findByID(req.params.uid);
    const docs = user.documents;

    let id = docs.find((el) => el.document.name.includes("id"));
    let address = docs.find((el) => el.document.name.includes("address"));
    let state = docs.find((el) => el.document.name.includes("state"));

    if (user.role === "user") {
      if (!id || !address || !state) {
        res.status(401).send({ status: "error", msg: "missing information" });
      } else {
        await userServices.upgrade(user._id, "premium");
        res
          .status(201)
          .send({ status: "success", msg: "user updated accordingly." });
      }
    } else {
      await userServices.upgrade(user._id, "user");
      res
        .status(201)
        .send({ status: "success", msg: "user updated accordingly." });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/:uid/edit", upload.single("pfp"), async (req, res) => {
  try {
    let id = { _id: req.params.uid };
    let { first_name, last_name, email, age, gender } = req.body;
    let pfp = req.file;
    let data;

    if (!first_name && !last_name && !email && !age && !gender && req.files.length === 0) {
      res.status(401).send({status: "error", msg: "There's not enough information to complete this request."})
    
    }

    if (pfp) {
      data = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        age: age,
        gender: gender,
        pfp: pfp.filename,
      };
    } else {
      data = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        age: age,
        gender: gender,
      };
    }
    Object.keys(data).forEach((k) => data[k] == "" && delete data[k]);

    let result = await userServices.updateUser(id, data);
    res.status(201).send("success");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/:uid/password", async (req, res) => {
  try {
    const { newPass, passConfirmation } = req.body;
    const id = { _id: req.params.uid };

    const user = await userServices.findByID(req.params.uid);

    if (validPass(user, req.body.newPass)) {
      res.status(400).send({
        status: "error",
        msg: "new password cannot be the same as old password",
      });
    } else if (newPass != passConfirmation) {
      res.status(401).send({ msg: "passwords are not matching." });
    } else {
      let result = await userServices.updateUser(id, { password: newPass });
      res.status(201).send({ msg: "successful password change." });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post(
  "/user/documents/:uid",
  upload.array("documents"),
  async (req, res) => {
    try {
      const uid = req.params.uid;

      let id = req.files.find((el) =>
        el.originalname.toLowerCase().startsWith("id")
      );
      let address = req.files.find((el) =>
        el.originalname.toLowerCase().startsWith("address")
      );
      let state = req.files.find((el) =>
        el.originalname.toLowerCase().startsWith("state")
      );

      if (!id && !address && !state) {
        res.status(401).send({ status: "error", msg: "missing info" });
      }

      if (id) {
        await userServices.addDocs(uid, {
          name: id.filename,
          reference: id.path,
        });
      }

      if (address) {
        await userServices.addDocs(uid, {
          name: address.filename,
          reference: address.path,
        });
      }

      if (state) {
        await userServices.addDocs(uid, {
          name: state.filename,
          reference: state.path,
        });
      }

      res.status(201).send({
        id: id,
        address: address,
        state: state,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

export default router;
