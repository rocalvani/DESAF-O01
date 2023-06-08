import { Router } from "express";
import { productService } from "../dao/managers/factory.js";
// import productService from "../dao/managers/db/services/product.service.js";
import { productModel } from "../dao/managers/db/models/products.js";
// import ProductManager from "../dao/managers/filesystem/ProductManager.js";

import { authorization } from "../utils.js";

const router = Router();

// router.get("/", async (req, res) => {
//   const products = await ProductManager.getProducts();
//   let { limit } = req.query;
//   const limited = products.slice(0, limit);
//   limit ? res.send(limited) : res.send(products);
// });

// router.get("/:pid", async (req, res) => {
//   const product = await ProductManager.getProductById(req.params.pid);
//   product ? res.send(product) : res.send("nothing to see here");
// });

router.post("/", authorization('admin'), async (req, res) => {
  let product = req.body;
  const products = await ProductManager.getProducts();
  let found = products.find((i) => i.code == product.code);
  if (found) {
    res.send("This product cannot share a code with another.");
  } else if (
    product.title == "" ||
    product.description == "" ||
    product.price == "" ||
    product.stock == "" ||
    product.code == "" ||
    product.status == ""||
    product.category == ""
  ) {
    res.send("This product is incomplete.");
  } else {
    new ProductManager(
      product.title,
      product.description,
      product.price,
      [product.thumbnail, product.thumbnail2, product.thumbnail3],
      product.code,
      product.stock,
      product.status == "false" ? product.status = false : product.status = true,
      product.category
      ).addProduct();
    res.send({ status: "success", product: product });
  }
});

// router.put("/:pid", async (req, res) =>{
//     ProductManager.updateProduct(req.params.pid, req.body.change, req.body.data)
//     res.send({ status: "product has been modified"});
// })

// router.delete("/:pid", async (req, res) => {
//   let product = await ProductManager.getProductById(req.params.pid)
//     if (product) {
//       ProductManager.deleteProduct(req.params.pid);
//     res.send({ status: "product has been deleted"});
//     } else {
//     res.send({ status: "buddy, this product doesn't even exist"});
//     }
// });

// router.get("/", async (req, res) => {
//   try {
//     let { limit, page, category, sort } = req.query;
//     limit == undefined ? (limit = 10) : (limit = limit);
//     page == undefined ? (page = 1) : (page = page);
//     sort == undefined ? (sort = 1) : (sort = sort);

//     if (category === undefined) {
//       let products = await productModel.paginate(
//         {},
//         { limit: limit, sort: { price: sort }, page: page }
//       );
//       res.send({
//         status: "success",
//         payload: products.docs,
//         totalPages: products.totalPages,
//         prevPage: products.prevPage,
//         nextPage: products.nextPage,
//         page: products.page,
//         hasPrevPage: products.hasPrevPage,
//         hasNextPage: products.hasNextPage,
//         prevLink: products.hasPrevPage
//           ? `http://localhost:8080/api/products?limit=${limit}&page=${products.prevPage}`
//           : null,
//         nextLink: products.hasNextPage
//           ? `http://localhost:8080/api/products?limit=${limit}&page=${products.nextPage}`
//           : null,
//       });
//     } else {
//       let products = await productModel.paginate(
//         { category: category },
//         { limit: limit, sort: { price: sort }, page: page }
//       );

//       res.send({
//         status: "success",
//         payload: products.docs,
//         totalPages: products.totalPages,
//         prevPage: products.prevPage,
//         nextPage: products.nextPage,
//         page: products.page,
//         hasPrevPage: products.hasPrevPage,
//         hasNextPage: products.hasNextPage,
//         prevLink: products.hasPrevPage
//           ? `http://localhost:8080/api/products?limit=${limit}&page=${products.prevPage}`
//           : null,
//         nextLink: products.hasNextPage
//           ? `http://localhost:8080/api/products?limit=${limit}&page=${products.nextPage}`
//           : null,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .send({ error: error, message: "could not obtain resources" });
//   }
// });

// router.get("/id/:pid", async (req, res) => {
//   const product = await productService.find(req.params.pid);
//   product ? res.send(product) : res.send({error: "this product doesn't exist"});
// });

// router.post("/", async (req, res) => {
//   try {
//     let result = await productService.save(req.body);
//     res.status(201).send(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: error, message: "couldn't save." });
//   }
// });

// router.delete("/:pid", async (req, res) => {
//   try {
//     let result = await productService.find(req.params.pid);

//     if (result) {
//       await productService.delete(result);
//       res.send({
//         status: "success",
//         msg: "this product has been successfully deleted",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: error, message: "couldn't delete." });
//   }
// });

const Regex = "([a-zA-Z%C3%A1%C3%A9%20]+)"
router.get(`/:word${Regex}`, async (req, res) => {
    try {
        const pets = req.product;
        if (!pets) {
            res.status(202).json({ msj: "No pets found" })
        }
        res.json(pets)
    } catch (error) {
        console.error("Error consultando las mascotas");
        res.status(500).send({ error: "Error consultando las mascotas", message: error });
    }
});

router.get("*", (req, res) => {
  res.status(404).send("Cannot get that URL!!")
});


//MIDDLEWARE
router.param("word", async (req, res, next, name) => {
  console.log("Buscando nombre de mascota con valor " + name);
  try {
      let result = await productService.findByName(name);
      if (!result) {
          req.product = null;
      } else {
          req.product = result;
      }
      next();
  } catch (error) {
      console.error("Error consultando las mascotas");
      res.status(500).send({ error: "Error consultando las mascotas", message: error });
  }
});

export default router;
