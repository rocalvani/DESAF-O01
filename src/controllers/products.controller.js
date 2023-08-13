import { userService } from "../dao/managers/factory.js";
import { productModel } from "../dao/managers/db/models/products.js";
import { productServices, userServices } from "../dao/repository/index.js";
import { generateProductErrorInfo } from "../errors/messages/productCreationErrorInfo.message.js";
import EErrors from "../errors/enums.js";
import CustomError from "../errors/CustomError.js";
import { generateServerError } from "../errors/messages/serverError.message.js";
import f from "session-file-store";
import { mailOptions, transporter } from "../mailing.js";

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
    limit == undefined || limit == "null" ? (limit = 15) : (limit = limit);
    page == undefined || page == "null" ? (page = 1) : (page = page);
    sort == undefined || sort == "null" ? (sort = 1) : (sort = -1);

    let user = await userService.find(req.user.email);

    if (category === "" || category === "null") {
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
      products.user = user.first_name;
      products.sort = sort;
      products.category = category;

      
      res.status(201).send(products);
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
    let products;

    if (user.role === "admin") {
      products = await productServices.get();
    } else {
      products = await productServices.findBy({ owner: user._id });
    }

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

// ---------- GET PRODUCTS BY TAG ---------- //

export const getProductsByTag = async (req, res) => {
  try {
    let products = await productServices.findBy({ "tags.tag": req.params.tag });
    res.status(201).send({ products: products });
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
    const { title, description, price, code, stock, status, category } =
      req.body;

    if (
      !title ||
      !description ||
      !price ||
      !code ||
      !status ||
      !category ||
      req.files.length === 0
    ) {
      req.logger.warning(
        `Product creation failed @ ${req.method} ${req.url} due to missing information`
      );
      res.status(401).send("missing info");

      CustomError.createError({
        name: "user creation error",
        cause: generateProductErrorInfo(),
        message: "User could not be created.",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }

    const codeProduct = await productServices.findBy({code: code})

    if (codeProduct == 1) {
      req.logger.warning(
        `Product creation failed @ ${req.method} ${req.url} due to duplicate code.`
      );

      CustomError.createError({
        name: "user creation error",
        cause: generateProductErrorInfo(req.user),
        message: "User could not be created.",
        code: EErrors.INVALID_TYPES_ERROR,
      });

      res.status(400).send("There already exists a product using this code.");
    }

    const user = await userServices.find(req.user.email);

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

      res.status(401).send("missing info");
    }

    // THUMBNAIL ARRAY SETTING //
    let thumbnails = [];
    req.files.forEach((el) => {
      thumbnails.push({ img: el.filename });
    });

    // PRODUCT OBJECT CREATION //

    const product = {
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnails,
      code: code,
      stock: stock,
      status: status,
      owner: user._id,
      category: category,
    };

    let result = await productServices.save(product);
    res.status(201).send({status: "success", msg: "product has been successfully created."});
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

// ---------- MODIFY A PRODUCT ---------- //

export const updateProduct = async (req, res) => {
  // REQ.BODY FOR STATUS, TAGS, IMG, STOCK, PRICE //
  try {
    let id = { _id: req.params.pid };
    let { price, stock, status } = req.body;
    let thumbnails = req.files;

    let data = {
      price: price,
      stock: stock,
      thumbnail: thumbnails,
      status: status,
    };

    Object.keys(data).forEach((k) => data[k] == "" && delete data[k]);

    let result = await productServices.updateProduct(id, data);
    if (!result) {
      res.status(404).send("This product does not exist");
    }
    res.status(201).redirect(303, "http://localhost:3000/admin");
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

    if (req.user.role == "admin") {
      // ALLOW ALL ADMINS TO DELETE //
      await productServices.delete(result);

      // EMAIL OWNER ABOUT THE DELETION // 
      let options = mailOptions(
        "Parece que tuvimos que borrar tu producto.",
        "Aviso por eliminación de producto",
        product.owner.email,
        []
      );
      transporter.sendMail(options, (error, info) => {
        if (error) {
          req.logger.fatal(`Server error @ ${req.method} ${req.url}`);

          CustomError.createError({
            name: "Server error",
            cause: generateServerError(),
            message: "Something went wrong on server end.",
            code: EErrors.DATABASE_ERROR,
          });
        }
      });

      res.status(201).send({
        status: "success",
        msg: "this product has been successfully deleted",
      });
    } else if (req.user.role == "premium") {
      // ALLOW PREMIUM USERS TO ONLY DELETE THEIR OWN PRODUCTS //
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
