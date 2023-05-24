import { cartModel } from "../dao/managers/db/models/carts.js";

export const getCart = async (req, res) => {
    try {
      let cart = await cartModel
        .findOne({ _id: req.params.cid })
        .populate("products.product");
      cart
        ? res.send(JSON.stringify(cart, null, "\t"))
        : res.send({ error: "uh-oh. it doesn't exist" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error, message: "couldn't find this cart" });
    }
  }