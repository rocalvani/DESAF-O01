import { userService } from "../dao/managers/factory.js";
import { productModel } from "../dao/managers/db/models/products.js";
import { productServices, userServices } from "../dao/repository/index.js";
import { generateProductErrorInfo } from "../errors/messages/productCreationErrorInfo.message.js";
import EErrors from "../errors/enums.js";
import CustomError from "../errors/CustomError.js";
import { generateServerError } from "../errors/messages/serverError.message.js";
import f from "session-file-store";

// ---------- GET ALL PRODUCTS ---------- //

export const getProducts = async (req, res) => {
  try {
    let products = await productServices.get();
    res.status(201).send(products);
  } catch (error) {
    req.logger.fatal(`Server error @ ${req.method} ${req.url}`);

    CustomError.createError({
      name: "Server error",
      cause: generateServerError(),
      message: "Something went wrong on server end.",
      code: EErrors.DATABASE_ERROR,
    });
    res.status(500).status("Something went wrong on our end.");
  }
};

// ---------- GET ALL PRODUCTS AND PAGINATE ---------- //

export const paginateProducts = async (req, res) => {
  try {
    let { limit, page, category, sort } = req.query;
    limit == undefined ? (limit = 12) : (limit = limit);
    page == undefined ? (page = 1) : (page = page);
    sort == undefined ? (sort = 1) : (sort = -1);

    let user = await userService.find(req.user.email);

    if (category === undefined) {
      let products = await productModel.paginate(
        {},
        { limit: limit, sort: { price: sort }, page: page, lean: true }
      );

      // DEFINE LINKS FOR PREVIOUS AND NEXT PAGES //
      products.prevLink = products.hasPrevPage
        ? `/shop?page=${products.prevPage}`
        : "";
      products.nextLink = products.hasNextPage
        ? `/shop?page=${products.nextPage}`
        : "";
      products.isValid = !(page <= 0 || page > products.totalPages);

      // SET USER FOR RENDER OBJECT //
      user ? (products.logged = true) : (products.logged = false);
      products.user = user.first_name;
      products.sort = sort;
      products.category = category;
      res.status(201).send(products);
    } else {
      let products = await productModel.paginate(
        { category: category },
        { limit: limit, sort: { price: sort }, page: page, lean: true }
      );

      // DEFINE LINKS FOR PREVIOUS AND NEXT PAGES //
      products.prevLink = products.hasPrevPage
        ? `/shop?page=${products.prevPage}`
        : "";
      products.nextLink = products.hasNextPage
        ? `/shop?page=${products.nextPage}`
        : "";
      products.isValid = !(page <= 0 || page > products.totalPages);

      // SET USER FOR RENDER OBJECT //
      user ? (products.logged = true) : (products.logged = false);
      pproducts.user = user.first_name;
      products.sort = sort;
      products.category = category;
      return res.status(201).send(products);
    }
  } catch (error) {
    req.logger.fatal(`Server error @ ${req.method} ${req.url}`);

    CustomError.createError({
      name: "Server error",
      cause: generateServerError(),
      message: "Something went wrong on server end.",
      code: EErrors.DATABASE_ERROR,
    });
  }
};

// ---------- GET ALL PRODUCTS BY OWNER ---------- //

export const getOwner = async (req, res) => {
  try {
    let user = await userServices.find(req.user.email);
    let products = await productServices.get();

    // let products = await productServices.findByOwner(user._id)
    res.status(201).send(products);
  } catch (error) {
    req.logger.fatal(`Server error @ ${req.method} ${req.url}`);

    CustomError.createError({
      name: "Server error",
      cause: generateServerError(),
      message: "Something went wrong on server end.",
      code: EErrors.DATABASE_ERROR,
    });
    res.status(500).status("Something went wrong on our end.");
  }
};

// ---------- GET A SINGLE PRODUCT BY ID ---------- //

export const getProduct = async (req, res) => {
  try {
    const product = await productServices.find(req.params.pid);

    if (!product) {
      req.logger.warning(`Product search failed @ ${req.method} ${req.url}`);

      CustomError.createError({
        name: "product search error",
        cause: generateProductErrorInfo(),
        message: "This product couldn't be found",
        code: EErrors.NOT_FOUND,
      });
      res.status(400).send("Product does not exist in the database.");
    }
    res.status(201).send(product);
  } catch (error) {
    req.logger.fatal(`Server error @ ${req.method} ${req.url}`);

    CustomError.createError({
      name: "Server error",
      cause: generateServerError(),
      message: "Something went wrong on server end.",
      code: EErrors.DATABASE_ERROR,
    });
    res.status(500).send("Something went wrong on our end.");
  }
};

// ---------- CREATE A PRODUCT ------------ //

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbnail,
      thumbnail2,
      thumbnail3,
      code,
      stock,
      status,
      category,
    } = req.body;


    if (
      !title ||
      !description ||
      !price ||
      !code ||
      !status ||
      !category
    ) {
      req.logger.warning(
        `Product creation failed @ ${req.method} ${req.url} due to missing information`
      );

      CustomError.createError({
        name: "user creation error",
        cause: generateProductErrorInfo(),
        message: "User could not be created.",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }

    const user = await userService.find(req.user.email);

    if (!user) {
      req.logger.warning(
        `Product creation failed @ ${req.method} ${req.url} due to missing user.`
      );

      CustomError.createError({
        name: "user creation error",
        cause: generateProductErrorInfo(),
        message: "User could not be created.",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }

    const thumbnails = [{img: thumbnail}, {img: thumbnail2}, {img: thumbnail3}]

    const product = {
          title: title,
          description: description,
          price: price,
          thumbnail:thumbnails,
          code: code,
          stock: stock,
          status: status,
          owner: user._id,
          category: category
         }
    let result = await productServices.save(product);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send("Something went wrong on our end.")
  }

};

// ---------- MODIFY A PRODUCT ---------- //

export const updateProduct = async (req, res) => {
    try {
      let result = await productServices.updateProduct(
        req.params.pid,
        req.body.stock
      );
      if (!result) {
        res.status(404).send("This product does not exist");
      } 
        res.status(201).send({ status: "product has been modified" });
      
    } catch (error) {
      req.logger.fatal(`Server error @ ${req.method} ${req.url}`);

      CustomError.createError({
        name: "Server error",
        cause: generateServerError(),
        message: "Something went wrong on server end.",
        code: EErrors.DATABASE_ERROR,
      });
      res.status(500).send("Something went wrong on our end.");
    
  };
};

// ---------- DELETE A PRODUCT ---------- //

export const deleteProduct = async (req, res) => {
  try {
    let product = await productServices.populated(req.params.pid);
    let result = await productServices.find(req.params.pid);

    // EVALUATE EXISTENCE OF PRODUCT //
    if (!product) {
      req.logger.warning(`Product deletion failed @ ${req.method} ${req.url}`);

      CustomError.createError({
        name: "product search error",
        cause: generateProductErrorInfo(),
        message: "This product couldn't be found",
        code: EErrors.NOT_FOUND,
      });
      res.status(400).send("This product doesn't exist.");
    }

    // ALLOW ALL ADMINS TO DELETE //
    if (req.user.role == "admin") {
      await productServices.delete(result);
      res.status(201).send({
        status: "success",
        msg: "this product has been successfully deleted",
      });
    }

    // ALLOW PREMIUM USERS TO ONLY DELETE THEIR OWN PRODUCTS //
    if (req.user.role == "premium") {
      if (product.owner.email != req.user.email) {
        res
          .status(400)
          .send(
            "this product does not belong to you, therefore, you cannot delete it."
          );
      } else {
        await productServices.delete(result);
        res.status(201).send({
          status: "success",
          msg: "this product has been successfully deleted",
        });
      }
    } else {
      res.status(400).send("you require admin credentials to do this.");
    }
  } catch (error) {
    req.logger.fatal(`Server error @ ${req.method} ${req.url}`);

    CustomError.createError({
      name: "Server error",
      cause: generateServerError(),
      message: "Something went wrong on server end.",
      code: EErrors.DATABASE_ERROR,
    });

    res.status(500).send("error");
  }
};
