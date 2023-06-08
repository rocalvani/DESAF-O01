import { productService } from "../dao/managers/factory.js";
import { productModel } from "../dao/managers/db/models/products.js";

export const getProducts = async (req, res) => {
  try {
    let products = await productService.getAll();
    res.send(products);
  } catch (error) {
    console.error("error al obtener noticias", error);
    res.status(500).json({ error: error.message });
  }
};

export const paginateProducts = async (req, res) => {
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

      products.prevLink = products.hasPrevPage
        ? `http://localhost:8080/shop?page=${products.prevPage}`
        : "";
      products.nextLink = products.hasNextPage
        ? `http://localhost:8080/shop?page=${products.nextPage}`
        : "";
      products.isValid = !(page <= 0 || page > products.totalPages);
      req.session.user ? (products.logged = true) : (products.logged = false);
      products.user = req.session.user;
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
      req.session.user ? (products.logged = true) : (products.logged = false);
      products.user = req.session.user;
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
    const product = await productService.find(req.params.pid);
    res.render("product", product);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: error, message: "could not obtain resources" });
  }
};
