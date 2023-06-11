import { Router } from "express";
import { authorization, passportCall } from "../utils.js";

import cartService from "../dao/managers/db/services/cart.service.js";
import { cartServices } from "../dao/repository/index.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    let result = await cartServices.save(req.body);
    res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: error, message: "couldn't create this cart" });
  }
});

// router.get("/:cid", async (req, res) => {
//   try {
//     let cart = await cartModel
//       .findOne({ _id: req.params.cid })
//       .populate("products.product");
//     cart
//       ? res.send(JSON.stringify(cart, null, "\t"))
//       : res.send({ error: "uh-oh. it doesn't exist" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: error, message: "couldn't find this cart" });
//   }
// });

router.post("/:cid/product/:pid", 
passportCall('jwt'), 
authorization('user'),
  async (req, res) => {
  try {

    // DESDE ROUTES 
    // let cart = await cartService.find(req.params.cid);
    // let product = await productService.find(req.params.pid);

    // await cart.products.push({ product: product });
    // let newCart = cart.products;
    // await cartService.update(req.params.cid, newCart);

    // DESDE SERVICE
   await cartService.addToCart(req.params.cid, req.params.pid);
   let cart = await cartServices.find(req.params.cid);
    res.send(cart);
  } catch (error) {
    res.status(500).send({
      error: error,
      message: "it looks like we could not add this product to the cart",
    });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {

    // DESDE ROUTES 
    // let cart = await cartService.find(req.params.cid);
    // let filter = await cart.products.filter(
    //   (el) => el.product != req.params.pid
    // );
    // await cartService.update(req.params.cid, filter);

    // DESDE SERVICE 
    let result = await cartServices.deleteProduct(req.params.cid, req.params.pid)
    res.send({status: "success", msg: "product deleted from this cart.", result: result});
  } catch(error) {
    res.status(500).send({
      error: error,
      message: "Nope. It can't be deleted.",
    });
  }
});

router.delete("/:cid", async (req,res) => {
  try {
    await cartServices.update(req.params.cid, []);
    res.send({status: "success", msg: "this cart was emptied."});
  }
  catch(error){ res.status(500).send({
    error: error,
    message: "Couldn't delete this cart for the reason stated right before this message.",
  });}
})

router.put ("/:cid/product/:pid", async (req, res) => {
  try {
    let cart = await cartServices.find(req.params.cid)
    let product = cart.products.find((el) => el.product == req.params.pid)
    let code = product._id

    if (product) {
      let result = await cartServices.updateCart(req.params.cid, code, req.body.quantity);
      cart = await cartServices.find(req.params.cid)
      res.send(cart)
    } else {
    res.status(404).send({msg: 'this is not a product found in cart with id ${cid}'});
    }
    
  } catch(error) {
    res.status(500).send({
      error: error,
      message: "Could not update the quantity for this product.",
    });
  }
})

router.put("/:cid", async (req,res) => {
  try {
    await cartServices.fill(req.params.cid);
    res.send({status: "success", msg: "this cart was filled."});
  }
  catch (error) {
    res.status(500).send({
      error: error,
      message: "Could not update this cart.",
    });
  }
})




export default router;
