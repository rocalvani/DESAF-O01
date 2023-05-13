import express from "express";
// import ProductManager from "../dao/managers/filesystem/ProductManager.js";
import { socketServer } from "../app.js";
import messageService from "../dao/managers/db/message.service.js";
import cookieParser from "cookie-parser";
import productService from "../dao/managers/db/product.service.js";
import { productModel } from "../dao/managers/db/models/products.js";
import cartService from "../dao/managers/db/cart.service.js";
import { cartModel } from "../dao/managers/db/models/carts.js";

const router = express.Router();

// const products = await ProductManager.getProducts();

// let food = [
//   { name: "banana", price: "10" },
//   { name: "orange", price: "40" },
// ];

// router.get("/food", (req, res) => {
//   let user = {
//     name: "ro",
//     color: "green",
//     role: "admin",
//   };
//   res.render("index", {
//     user: user,
//     isAdmin: user.role === "admin",
//     food,
//   });
// });

// router.get("/food2", (req, res) => {
//   let user = {
//     name: "ro",
//     color: "green",
//     role: "user",
//   };
//   res.render("index", {
//     user: user,
//     isAdmin: user.role === "admin",
//     food,
//   });
// });

// router.get("/realtimeproducts", async (req, res) => {
//   let { limit } = req.query;
//   const limited = products.slice(0, limit);
//   limit
//     ? res.render("realTimeProducts", { products: limited })
//     : res.render("realTimeProducts", { products: products });
// });

// router.post("/realtimeproducts", (req, res) => {
//   socketServer.on('connection', async socket => {
//     let product = req.body;
//   await new ProductManager(
//     product.title,
//     product.description,
//     product.price,
//     [product.thumbnail, product.thumbnail2, product.thumbnail3],
//     product.code,
//     product.stock,
//     product.status == "false"
//       ? (product.status = false)
//       : (product.status = true),
//     product.category
//   ).addProduct();
//   const products = await ProductManager.getProducts();
//     socketServer.emit('products', products)
//   })
//   res.render("realtimeproducts", {products:products})
// });

// router.get("/home", async (req, res) => {
//   const products = await ProductManager.getProducts();
//   let { limit } = req.query;
//   const limited = products.slice(0, limit);
//   limit
//     ? res.render("home", { products: limited })
//     : res.render("home", { products: products });
// });

// CHAT

router.get("/chat", async (req, res) => {
  try {
    let messages = await messageService.getAll();
    res.render("chat", { messages: messages });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error, message: "Nothing to see here" });
  }
});

router.post("/chat", (req, res) => {
  socketServer.on("connection", async (socket) => {
    try {
      let msg = await messageService.save(req.body);
      let chat = await messageService.getAll();
      socketServer.emit("messages", chat);
      res.render("chat", { messages: [] });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error, message: "Nothing to see here" });
    }
  });
});

// PRODUCTS

router.get("/products", async (req, res) => {
  try {
    let { limit, page, category, sort } = req.query;
    limit == undefined ? (limit = 12) : (limit = limit);
    page == undefined ? (page = 1) : (page = page);
    sort == undefined ? (sort = 1) : (sort = -1);

    if (category === undefined) {
      let products = await productModel.paginate(
        {},
        { limit: limit, sort: { price: sort }, page: page, lean: true }
      );

      products.prevLink = products.hasPrevPage?`http://localhost:8080/products?page=${products.prevPage}`:'';
    products.nextLink = products.hasNextPage?`http://localhost:8080/products?page=${products.nextPage}`:'';
    products.isValid= !(page<=0||page>products.totalPages)
    req.session.user ? products.logged = true : products.logged = false
    products.user = req.session.user
      res.render("products", products);
      
    } else {
      let products = await productModel.paginate(
        { category: category },
        { limit: limit, sort: { price: sort }, page: page, lean:true}
      );

      products.prevLink = products.hasPrevPage?`http://localhost:8080/products?page=${products.prevPage}`:'';
    products.nextLink = products.hasNextPage?`http://localhost:8080/products?page=${products.nextPage}`:'';
    products.isValid= !(page<=0||page>products.totalPages)
    req.session.user ? products.logged = true : products.logged = false
products.user = req.session.user
      res.render("products", products)
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: error, message: "could not obtain resources" });
  }
});

router.get("/products/:pid", async (req, res) => {
  try {const product = await productService.find(req.params.pid);
    res.render("product", product)}
  catch(error) { console.error(error);
    res
      .status(500)
      .send({ error: error, message: "could not obtain resources" });}
})

router.get("/carts/:cid", async(req,res) => {
try {
  let cart = await cartModel.findOne({ _id: req.params.cid }).populate("products.product").lean();
  res.render("cart", cart)
}
catch(error) { console.error(error);
  res
    .status(500)
    .send({ error: error, message: "could not obtain resources" });}
})

// HABILITACIÓN DE MIDDLEWARE PARA COOKIES

router.use(cookieParser("elsecretodero"));

router.get("/cookie", (req, res) => {
  res.render("index", {});
});

router.get("/setCookie", (req, res) => {
  res
    .cookie("coder", "una cookie", { maxAge: 30000, signed: true })
    .send("cookie enviada");
});

router.get("/getCookie", (req, res) => {
  // res.send(req.cookies)
  res.send(req.signedCookies);
});

router.get("/deleteCookie", (req, res) => {
  res.clearCookie("coder").send("borrado");
});

// SESSIONS

router.get('/session', (req, res)=>{
  if(req.session.counter){
      req.session.counter++;
      res.send(`Se ha visitado este sitio ${req.session.counter} veces` )
  }else{
      req.session.counter = 1;
      res.send("Bienvenido!!")
  }
})

router.get("/login", (req,res) => {
  const {username,password} = req.query

  if (username != "ro" || password != "pass"){
    return res.status(401).send("either your password or username's wrong buddy")
  } else { 
    req.session.user = username;
    req.session.admin = true
    res.send("hola, login exitoso")
  }
})

export default router;
