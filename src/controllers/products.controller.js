import {userService } from "../dao/managers/factory.js";
import { productModel } from "../dao/managers/db/models/products.js";
import { productServices } from "../dao/repository/index.js";
import { generateProductErrorInfo } from "../errors/messages/productCreationErrorInfo.message.js";
import EErrors from "../errors/enums.js";
import CustomError from "../errors/CustomError.js";
import { generateServerError } from "../errors/messages/serverError.message.js";


export const getProducts = async (req, res) => {

  try {
    let products = await productServices.get()
    res.send(products);
  } catch (error) {
    req.logger.fatal(`Server error @ ${req.method} ${req.url}` )

    CustomError.createError({
      name: "Server error",
      cause: generateServerError(),
      message: "Something went wrong on server end.",
      code: EErrors.DATABASE_ERROR
    })
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

    req.logger.fatal(`Server error @ ${req.method} ${req.url}` )

    CustomError.createError({
      name: "Server error",
      cause: generateServerError(),
      message: "Something went wrong on server end.",
      code: EErrors.DATABASE_ERROR
    })
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await productServices.find(req.params.pid);
  
    if (!product) {
      req.logger.warning(`Product search failed @ ${req.method} ${req.url}` )

      CustomError.createError({
        name: "product search error",
        cause: generateProductErrorInfo(),
        message: "This product couldn't be found",
        code: EErrors.NOT_FOUND
      })
     }
    res.send(product);
  } catch (error) {
    req.logger.fatal(`Server error @ ${req.method} ${req.url}` )

    CustomError.createError({
      name: "Server error",
      cause: generateServerError(),
      message: "Something went wrong on server end.",
      code: EErrors.DATABASE_ERROR
    })
  }
};


// MANAGE PRODUCTS

export const createProduct = async (req, res) => {
  try {
    const {title, description, price, thumbnail, code, stock, status} = req.body
    
    if (!title || !description || !price || !thumbnail || !code || !status) {
      req.logger.warning(`Product creation failed @ ${req.method} ${req.url}` )

      CustomError.createError({
        name: "user creation error",
        cause: generateProductErrorInfo(),
        message: "User could not be created.",
        code: EErrors.INVALID_TYPES_ERROR
      })
     }

     const user = await userService.find(req.user.email)

     const product = {
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
      status: status,
      owner: user._id
     }

    let result = await productServices.save(req.body);
    res.status(201).send(result);
  } catch (error) {
    req.logger.fatal(`Server error @ ${req.method} ${req.url}` )

    CustomError.createError({
      name: "Server error",
      cause: generateServerError(),
      message: "Something went wrong on server end.",
      code: EErrors.DATABASE_ERROR
    })  }
}

export const updateProduct = async (req,res) => {
  async (req, res) =>{
  try {
    let result = await productServices.updateProduct(req.params.pid, req.body)
    res.send({ status: "product has been modified"});
  } catch (error) {

    req.logger.fatal(`Server error @ ${req.method} ${req.url}` )

    CustomError.createError({
      name: "Server error",
      cause: generateServerError(),
      message: "Something went wrong on server end.",
      code: EErrors.DATABASE_ERROR
    })
  }
}
}

// export const deleteProduct = async (req,res) => {
//   async (req, res) => {
//     try {
//       let result = await productServices.find(req.params.pid);
  
//       if (result) {
//         await productServices.delete(result);
//         res.send({
//           status: "success",
//           msg: "this product has been successfully deleted",
//         });
//       } else {
//         if (!product) {
//           req.logger.warning(`Product deletion failed @ ${req.method} ${req.url}` )

//           CustomError.createError({
//             name: "product search error",
//             cause: generateProductErrorInfo(),
//             message: "This product couldn't be found",
//             code: EErrors.NOT_FOUND
//           })
//          }
//       }
//     } catch (error) {
//       req.logger.fatal(`Server error @ ${req.method} ${req.url}` )
      
//       CustomError.createError({
//         name: "Server error",
//         cause: generateServerError(),
//         message: "Something went wrong on server end.",
//         code: EErrors.DATABASE_ERROR
//       })
//     }
//   }
// }

export const deleteProduct = async (req,res) => {

    try {
      let product = await productServices.populated(req.params.pid);
      let result = await productServices.find(req.params.pid)

      if (!product) {
        req.logger.warning(`Product deletion failed @ ${req.method} ${req.url}` )

        CustomError.createError({
          name: "product search error",
          cause: generateProductErrorInfo(),
          message: "This product couldn't be found",
          code: EErrors.NOT_FOUND
        })
       }

       if (req.user.role == "admin") {
        await productServices.delete(result);
            res.send({
              status: "success",
              msg: "this product has been successfully deleted",
            });
  
       }

       if (req.user.role == "premium") {
           if (product.owner.email != req.user.email) {
        res.send({status: "error", msg: "this product does not belong to you, therefore, you cannot delete it."})
      } else {
          await productServices.delete(result);
          res.send({
            status: "success",
            msg: "this product has been successfully deleted",
          });

      }
       } else {
        res.send("you require admin credentials to do this.")
       }
   
    } catch (error) {
      // req.logger.fatal(`Server error @ ${req.method} ${req.url}` )
      
      // CustomError.createError({
      //   name: "Server error",
      //   cause: generateServerError(),
      //   message: "Something went wrong on server end.",
      //   code: EErrors.DATABASE_ERROR
      // })

      res.send("error")
    }
}