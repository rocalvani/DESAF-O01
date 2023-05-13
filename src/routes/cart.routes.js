import { Router } from "express";
import CartManager from "../dao/managers/filesystem/CartManager.js";
import ProductManager from "../dao/managers/filesystem/ProductManager.js";
import cartService from "../dao/managers/db/cart.service.js";
import productService from "../dao/managers/db/product.service.js";
import { cartModel } from "../dao/managers/db/models/carts.js";

const router = Router();

// router.post("/", (req, res) => {
//   new CartManager([]).addCart();
//   res.send({ status: "This cart has successfully been created." });
// });

// router.get("/:cid", async (req, res) => {
//   let cart = await CartManager.getCartById(req.params.cid);
//   cart ? res.send(cart.products) : res.send({error: "uh-oh. it doesn't exist"});
// });

// router.post("/:cid/product/:pid", async (req, res) => {
//   let cart = await CartManager.getCartById(req.params.cid);
//   let productById = await ProductManager.getProductById(req.params.pid);
//  if (productById) {
//   let inCart = cart.products.find((el) => el.product == productById.id);

//   if (inCart) {
//     inCart.quantity++;
//   } else {
//     let product = {
//       product: productById.id,
//       quantity: 1,
//     };
//     cart.products.push(product);
//   }
//   CartManager.updateCart(req.params.cid, cart.products);
//   res.send(cart);
//  } else {
//   res.send({error: "that's just not a real product."});
//  }

// });

router.post("/", async (req, res) => {
  try {
    let result = await cartService.save(req.body);
    res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: error, message: "couldn't create this cart" });
  }
});

router.get("/:cid", async (req, res) => {
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
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {

    // DESDE ROUTES 
    // let cart = await cartService.find(req.params.cid);
    // let product = await productService.find(req.params.pid);

    // await cart.products.push({ product: product });
    // let newCart = cart.products;
    // await cartService.update(req.params.cid, newCart);

    // DESDE SERVICE
   await cartService.addToCart(req.params.cid, req.params.pid);
   let cart = await cartService.find(req.params.cid);
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
    let result = await cartService.deleteProduct(req.params.cid, req.params.pid)
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
    await cartService.update(req.params.cid, []);
    res.send({status: "success", msg: "this cart was emptied."});
  }
  catch(error){ res.status(500).send({
    error: error,
    message: "Couldn't delete this cart for the reason stated right before this message.",
  });}
})

router.put ("/:cid/product/:pid", async (req, res) => {
  try {
    let cart = await cartService.find(req.params.cid)
    let product = cart.products.find((el) => el.product == req.params.pid)
    let code = product._id

    if (product) {
      let result = await cartService.updateCart(req.params.cid, code, req.body.quantity);
      cart = await cartService.find(req.params.cid)
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
    await cartService.fill(req.params.cid);
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
