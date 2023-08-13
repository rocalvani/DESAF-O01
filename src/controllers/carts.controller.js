import nodemailer from "nodemailer";
import config from "../config/config.js";
import { v4 as uuidv4 } from 'uuid';
import { ticketService} from "../dao/managers/factory.js";
import { cartServices, productServices } from "../dao/repository/index.js";
import CustomError from "../errors/CustomError.js";
import { productService } from "../dao/managers/factory.js";
import EErrors from "../errors/enums.js";
import { generateServerError } from "../errors/messages/serverError.message.js";


// ----------   FIND ONE CART ---------- //
export const getCart = async (req, res) => {
  try {
    let cart = await cartServices.populated(req.params.cid)

    cart
      ? // ? res.send(JSON.stringify(cart, null, "\t"))
        res.status(201).send({ id: cart._id, products: cart.products })
      : res.status(404).send({ error: "uh-oh. it doesn't exist" });
  } catch (error) {

    req.logger.fatal(`Server error @ ${req.method} ${req.url}` )

    CustomError.createError({
      name: "Server error",
      cause: generateServerError(),
      message: "Something went wrong on server end.",
      code: EErrors.DATABASE_ERROR
    })
    res.status(500).send("There was an error on our end.")
  }
};

// ---------- ADD PRODUCT TO CART ---------- //

export const addProductToCart = async (req, res) => {
  try {
    let cart = await cartServices.find(req.params.cid)
    let productIN = cart.products.find((el) => el.product == req.params.pid)
    let product = await productService.populated(req.params.pid)

    // EVALUATE THAT OWNER AND CART RECEIPIENT ARE NOT THE SAME //
    if (req.user.email != product.owner.email){
      if (productIN) {
        let code = productIN._id
        let result = await cartServices.updateCart(req.params.cid, code, productIN.quantity ++);}
        else {
          let result = await cartServices.addProduct(req.params.cid, req.params.pid) 
        }
      let cart = await cartServices.find(req.params.cid);
       res.status(201).send(cart);
    } else {
      res.status(401).send({
        error: error,
        message: "you cannot add your own products to your cart."
      })
    }


  } catch (error) {
    res.status(500).send({
      error: error,
      message: "it looks like we could not add this product to the cart",
    });
  }
}

// ---------- DELETE PRODUCT FROM CART ---------- //

export const deleteProductFromCart = async (req, res) => {
  try {
    let result = await cartServices.deleteProduct(req.params.cid, req.params.pid)
    let cart = await cartServices.populated(req.params.cid)
    res.status(201).send({status: "success", cart: cart,msg: "product deleted from this cart.", result: result});
  } catch(error) {
    res.status(500).send({
      error: error,
      message: "Nope. It can't be deleted.",
    });
  }
}

// ---------- EMPTY CART ---------- //

export const emptyCart = async (req,res) => {
  try {
    await cartServices.update(req.params.cid, []);
    res.status(201).send({status: "success", msg: "this cart was emptied."});
  }
  catch(error){ res.status(500).send({
    error: error,
    message: "Couldn't delete this cart for the reason stated right before this message.",
  });}
}

// ---------- MODIFY QUANTITY OF A PRODUCT IN CART ---------- //
export const addMoreOf = async (req, res) => {
  try {
    let cart = await cartServices.find(req.params.cid)
    let product = cart.products.find((el) => el._id == req.params.pid)
    let code = product._id


    if (product) {
      let result = await cartServices.updateCart(req.params.cid, code, req.body.quantity);
      cart = await cartServices.find(req.params.cid)
      res.status(201).send(cart)
    } else {
    res.status(404).send({msg: 'this is not a product found in cart with id ${cid}'});
    }
    
  } catch(error) {
    res.status(500).send({
      error: error,
      message: "Could not update the quantity for this product.",
    });
  }
}

// ---------- AUTOFILL CART ---------- //

export const autofill = async (req,res) => {
  try {
    await cartServices.fill(req.params.cid);
    res.status(201).send({status: "success", msg: "this cart was filled."});
  }
  catch (error) {
    res.status(500).send({
      error: error,
      message: "Could not update this cart.",
    });
  }
}

// ---------- FINALIZE PURCHASE ----------// 

export const purchase = async (req, res) => {
  try {
    let cart = await cartServices.populated(req.params.cid)

    //CHEQUEO DE STOCK

    let finalCart = [];
    let amount = 0;

    await cart.products.forEach(async (el) => {
      if (el.product.stock < el.quantity) {
        finalCart.push({ product: el.product._id });
      } else {
        await productServices.update(
          el.product._id,
          el.product.stock - el.quantity
        );
        amount = amount + el.quantity;
      }
    });

    // ACTUALIZA EL CART

    await cartServices.update(cart._id, finalCart);

    let update = await cartServices.populated(req.params.cid)

    // SI HAY PRODUCTOS A COMPRAR

    if (amount != 0) {
      // GENERA TICKET //
      // let random = (Math.random() + 1).toString(36).substring(2);
      let random = uuidv4();

      const found = ticketService.getTicketByCode(random);
      found ? (random = uuidv4()) : random;

      let ticket = {
        code: random,
        purchase_datetime: new Date(),
        amount: amount,
        purchaser: cart.user.email,
      };

      ticketService.saveTicket(ticket);
      res.status(201).send({msg: "purchase was a success", productsLeft: finalCart, code: random})
    } else {
      res.status(400).send({msg: "This cart has no products available for purchase.", productsLeft: finalCart});
    }
  } catch (error) {
    req.logger.fatal(`Server error @ ${req.method} ${req.url}` )

    CustomError.createError({
      name: "Server error",
      cause: generateServerError(),
      message: "Something went wrong on server end.",
      code: EErrors.DATABASE_ERROR
    })

    res.status(500).send("There was an error on our end.")
   }
};

// MAILING
export const finalize = async (req, res) => {

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.gmailAccount,
    pass: config.gmailAppPassword,
  },
});
  const mailOptions = {
    from: "uwu" + config.gmailAccount,
    to: req.user.email,
    subject: "Gracias por realizar tu compra en uwu",
    html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Factura de compra</title>
  </head>
  <body>
    <center>
      <table width="750">
        <tr>
          <td width="750" colspan="3">
            <img src="" alt="" style="width: 750px; height: 250px" />
          </td>
        </tr>
        <tr width="750" colspan="3" height="50">
          <td></td>
        </tr>
        <tr>
          <td width="50"></td>
          <td width="650" style="text-align: center; font-family: Arial, Helvetica, sans-serif; font-size: 15pt;">

            <p>Primero que nada: <b>GRACIAS</b>. (｡◕‿‿◕｡)<br>
                Esperamos que disfrutes mucho tus productos cuando lleguen a vos!!</p>
<p>Tu compra tiene el siguiente código:</p>
<p><span style="background-color: pink; padding: 10pt;"><b>${req.params.code}</b></span> </p>
<p><br>Es importante que lo guardes ya que para retirar los productos, o al llegar nuestro envío a la dirección de entrega, se corroborará que tu código sea el indicado para evitar errores.</p>
<p>Además, te dejamos adjunta la factura indicada a tu compra.</p>
<p>Ojalá tengas un muy buen día y sigas brillando con nosotros!!</p>
<p>✧ &#9825; ✧</p>

          </td>
          <td width="50"></td>
        </tr>
        <tr width="750" colspan="3" height="50">
          <td></td>
        </tr>
        <tr>
          <td width="750" colspan="3">
            <img src="" alt="" style="width: 750px; height: 50px" />
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>`,
    attachments: [],
  };

  let result = transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      req.logger.fatal(`Server error @ ${req.method} ${req.url}` )
      
      CustomError.createError({
        name: "Server error",
        cause: generateServerError(),
        message: "Something went wrong on server end.",
        code: EErrors.DATABASE_ERROR
      })

      res.status(500).send("Something went wrong on our end.")
    }
    res.status(201).send(mailOptions);
  });
};
