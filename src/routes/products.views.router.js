import { Router } from "express";
import { getProduct, getProducts, paginateProducts } from "../controllers/products.controller.js";

const router = Router();

router.get('/', paginateProducts)
// router.get("/", getProducts)
router.get('/:pid', getProduct)

export default router