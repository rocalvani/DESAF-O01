import { Router } from "express";
import { finalize, getCart, purchase } from "../controllers/carts.controller.js";

const router = Router();

router.get("/:cid", getCart);

// PURCHASE
router.post('/:cid/purchase', purchase)
router.get('/:cid/purchase/:code', finalize)

export default router;
