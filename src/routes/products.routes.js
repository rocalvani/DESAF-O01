import { Router } from "express";
import { productService } from "../dao/managers/factory.js";

import { authorization, passportCall } from "../utils.js";
import { createProduct, deleteProduct, updateProduct} from "../controllers/products.controller.js";

const router = Router();

router.post("/", passportCall('jwt'), authorization('admin'), createProduct);
router.put("/:pid",passportCall('jwt'), authorization('admin'), updateProduct)
router.delete("/:pid", passportCall('jwt'), authorization('admin'),deleteProduct );


const Regex = "([a-zA-Z%C3%A1%C3%A9%20]+)"
router.get(`/:word${Regex}`, async (req, res) => {
    try {
        const pets = req.product;
        if (!pets) {
            res.status(202).json({ msj: "No pets found" })
        }
        res.json(pets)
    } catch (error) {
        req.logger.fatal(`Server error @ ${req.method} ${req.url}` )
        res.status(500).send({ error: "Error consultando las mascotas", message: error });
    }
});

router.get("*", (req, res) => {
  res.status(404).send("Cannot get that URL!!")
});


//MIDDLEWARE
router.param("word", async (req, res, next, name) => {
  try {
      let result = await productService.findByName(name);
      if (!result) {
          req.product = null;
      } else {
          req.product = result;
      }
      next();
  } catch (error) {
    req.logger.fatal(`Server error @ ${req.method} ${req.url}` )
      res.status(500).send({ error: "Error consultando las mascotas", message: error });
  }
});

export default router;
