import { Router } from "express";
import {
  getProduct,
  getProducts,
  paginateProducts,
} from "../controllers/products.controller.js";
import { passportCall } from ".././utils.js";

const router = Router();

router.get("/", passportCall("jwt"), paginateProducts);
router.get("/react", getProducts);
router.get("/:pid", getProduct);

export default router;
