import {userService } from "../dao/managers/factory.js";
import { productModel } from "../dao/managers/db/models/products.js";
import { productServices } from "../dao/repository/index.js";

export const getProducts = async (req, res) => {
  try {
    let products = await productServices.get();
    res.send(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const paginateProducts = async (req, res) => {
  try {
    let { limit, page, category, sort } = req.query;
    limit == undefined ? (limit = 12) : (limit = limit);
    page == undefined ? (page = 1) : (page = page);
    sort == undefined ? (sort = 1) : (sort = -1);

    let user = await userService.find(req.user.email)
    
    if (category === undefined) {
      let products = await productModel.paginate(
        {},
        { limit: limit, sort: { price: sort }, page: page, lean: true }
      );

      products.prevLink = products.hasPrevPage
        ? `http://localhost:8080/shop?page=${products.prevPage}`
        : "";
      products.nextLink = products.hasNextPage
        ? `http://localhost:8080/shop?page=${products.nextPage}`
        : "";
      products.isValid = !(page <= 0 || page > products.totalPages);
      user ? (products.logged = true) : (products.logged = false);
      products.user = user.first_name;
      res.render("products", products);
    } else {
      let products = await productModel.paginate(
        { category: category },
        { limit: limit, sort: { price: sort }, page: page, lean: true }
      );

      products.prevLink = products.hasPrevPage
        ? `http://localhost:8080/shop?page=${products.prevPage}`
        : "";
      products.nextLink = products.hasNextPage
        ? `http://localhost:8080/shop?page=${products.nextPage}`
        : "";
      products.isValid = !(page <= 0 || page > products.totalPages);
      user ? (products.logged = true) : (products.logged = false);
      pproducts.user = user.first_name;
      return res.render("products", products);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: error, message: "could not obtain resources" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await productServices.find(req.params.pid);
    res.render("product", product);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: error, message: "could not obtain resources" });
  }
};


// MANAGE PRODUCTS

export const createProduct = async (req, res) => {
  try {
    let result = await productServices.save(req.body);
    res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error, message: "couldn't save." });
  }
}

export const updateProduct = async (req,res) => {
  async (req, res) =>{
   let result = await productServices.updateProduct(req.params.pid, req.body)
    res.send({ status: "product has been modified"});
}
}

export const deleteProduct = async (req,res) => {
  async (req, res) => {
    try {
      let result = await productServices.find(req.params.pid);
  
      if (result) {
        await productServices.delete(result);
        res.send({
          status: "success",
          msg: "this product has been successfully deleted",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error, message: "couldn't delete." });
    }
  }
}