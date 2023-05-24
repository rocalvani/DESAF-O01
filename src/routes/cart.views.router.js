import { Router } from "express";
import { getCart } from "../controllers/carts.controller.js";

const router = Router();

router.get("/:cid", getCart);

export default router