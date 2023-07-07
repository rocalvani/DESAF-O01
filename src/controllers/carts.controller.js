import nodemailer from "nodemailer";
import config from "../config/config.js";
import { v4 as uuidv4 } from 'uuid';
import { ticketService} from "../dao/managers/factory.js";
import { cartServices, productServices } from "../dao/repository/index.js";
import CustomError from "../errors/CustomError.js";

export const getCart = async (req, res) => {
  try {
    let cart = await cartServices.populated(req.params.cid)

    cart
      ? // ? res.send(JSON.stringify(cart, null, "\t"))
        res.render("cart", { products: cart.products })
      : res.send({ error: "uh-oh. it doesn't exist" });
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

// ------------- FINALIZACIÓN DE COMPRA --------------------// 

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
      res.send({msg: "purchase was a success", productsLeft: finalCart})
    } else {
      res.send({ msg: "This cart has no products available for purchase." });
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
    to: config.gmailAccount,
    subject: "Gracias por realizar tu compra en uwu",
    html: `<div><h1>Gracias por tu compra!</h1></div>`,
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
    }
    res.send(mailOptions);
  });
};
