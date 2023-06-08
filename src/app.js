import express from "express";
import handlebars from "express-handlebars"
import mongoose from "mongoose";
import session from 'express-session'
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import { Server, Socket } from "socket.io";
import FileStore  from "session-file-store";
import MongoStore from "connect-mongo";

import _dirname from "./utils.js"

import ProductManager from "./dao/managers/filesystem/ProductManager.js";
import messageService from "./dao/managers/db/services/message.service.js";
import { productModel } from "./dao/managers/db/models/products.js";


import viewRouter from "./routes/views.routes.js"
import productsRouter from "./routes/products.routes.js"
import cartsRouter from "./routes/cart.routes.js"
import usersRouter from "./routes/user.routes.js"
import usersViewRouter from './routes/users.views.router.js';
import sessionsRouter from "./routes/sessions.routes.js"
import githubLoginRouter from "./routes/githubLogin.views.router.js"
import jwtRouter from './routes/jwt.router.js'
import productsViewsRouter from './routes/products.views.router.js'
import cartViewsRouter from './routes/cart.views.router.js'

import config from "./config/config.js";
// import MDBSingleton from "./config/MDBSingleton.js";

import cors from 'cors'

const app = express();
// const fileStore = FileStore(session)

app.use(express.static(_dirname + "/public"))

// const PORT = process.env.port || 8080;
// const db = "mongodb+srv://admin:rocio1@cluster0.facejpa.mongodb.net/Ecommerce"
const db = config.DB
const PORT = config.port

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.engine('handlebars', handlebars.engine())
app.set('views', _dirname +"/views/")
app.set('view engine', 'handlebars')

// SESSION VA ANTES DE ROUTERS

app.use(session({
  store: MongoStore.create({
    mongoUrl: db,
    mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
    ttl: 60
  }),
  secret: "secret",
  resave: false,
  saveUninitialized: true
}))

// PASSPORT 
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// ROUTER
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/users', usersRouter)
app.use('/api/sessions',sessionsRouter);
app.use('/github', githubLoginRouter);
app.use("/api/jwt", jwtRouter);

// ROUTER VIEWS
app.use('/', viewRouter)
app.use('/users',usersViewRouter);
app.use("/shop", productsViewsRouter)
app.use("/checkout", cartViewsRouter)

const httpServer = app.listen(PORT, () => {
  console.log(`Este server corre mediante: ${PORT} `)

  // console.log(process.argv)
  // console.log(config)
});

// SESSIONS


// app.use(session({
//   store: new fileStore({path: "./sessions", ttl: 40, retries:0}),
//   secret: "secreto",
//   resave: false,
//   saveUninitialized: true
// }))



// SOCKET 

 export const socketServer = new Server(httpServer)

socketServer.on('connection', socket => {
  console.log("nuevo cliente conectado")

//  socket.on("id",async id=>{
//     await ProductManager.deleteProduct(id);
//     const products = await ProductManager.getProducts()
//      socketServer.emit('products', products)
//  });

//  socket.on('product', async data => {
//   await new ProductManager(
//     data.title,
//     data.description,
//     data.price,
//     [data.thumbnail, data.thumbnail2, data.thumbnail3],
//     data.code,
//     data.stock,
//     data.status == "false" ? data.status = false : data.status = true,
//     data.category
//     ).addProduct();
//     const products = await ProductManager.getProducts()
//     socketServer.emit('products', products)
//  } )
socket.on("message", async data => {
  let result = await messageService.save(data)
  let chat = await messageService.getAll()
  socketServer.emit("messages", chat)
})
})

// BASE DE DATOS //
// const connectMongoDB = async() => {
//   try {
//     await mongoose.connect(db)
//     console.log("conectado a la base de datos"
//     )
//   } catch (err) {
//     console.log("error")
//     process.exit()
//   }
// }

// const mongoInstance = async () => {
//   try {
//     await MDBSingleton.getInstance()
//   } catch (error) {
//     console.error(error)
//   }
// } 

// mongoInstance()