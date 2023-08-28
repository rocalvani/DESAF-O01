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
import cluster from 'cluster'
import {cpus} from 'os'
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUIExpress from "swagger-ui-express"
import methodOverride from 'method-override'


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
import commmentRouter from './routes/comment.routes.js'
import wishlistRouter from './routes/wishlist.routes.js'
import paymentRouter from './routes/payments.routes.js'

import config from "./config/config.js";
// import MDBSingleton from "./config/MDBSingleton.js";

import cors from 'cors'

import compression from "express-compression";

import errorHandler from './errors/index.js'
import addLogger from "./config/logger.js";
import { Console } from "console";

const app = express();
// const fileStore = FileStore(session)

app.use(express.static(_dirname + "/public"))

// const PORT = process.env.port || 8080;
// const db = "mongodb+srv://admin:rocio1@cluster0.facejpa.mongodb.net/Ecommerce"
const db = config.DB
const PORT = config.port

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin:'http://localhost:3000', 
credentials:true,  methods: ["GET", "POST", "PUT", "DELETE"],
allowedHeaders: [
  "Content-Type",
  "Authorization",
  "Access-Control-Allow-Credentials",
],}))
// app.use(compression())
app.use(addLogger)

app.use(compression({
  brotli: {enabled: true, zlib: {}}
}))

// SWAGGER SETTING 
const swaggerOptions = {
  definition: {
      openapi: '3.1.0',
      info: {
          title: 'UWU API docs',
          description: 'product and cart docs using swagger'
      }
  },
  apis: [`./docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs));

//HANDLEBARS SETTING

app.engine('handlebars', handlebars.engine())
app.set('views', _dirname +"/views/")
app.set('view engine', 'handlebars')

// OVERRIDE
app.use(methodOverride("_method"));


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

// COOKIE PARSER
app.use(cookieParser('jwtCookieToken'))

// ROUTER
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/users', usersRouter)
app.use('/api/sessions',sessionsRouter);
app.use('/github', githubLoginRouter);
app.use("/api/jwt", jwtRouter);
app.use("/api/comment", commmentRouter)
app.use("/api/wishlist", wishlistRouter)
app.use('/api/payments', paymentRouter)

// ROUTER VIEWS
app.use('/', viewRouter)
app.use('/users',usersViewRouter);
app.use("/shop", productsViewsRouter)
app.use("/checkout", cartViewsRouter)



const httpServer = app.listen(PORT, () => {
  console.log(`Este server corre mediante: ${PORT} `)
});

app.use(errorHandler)
// SOCKET 

 export const socketServer = new Server(httpServer)

socketServer.on('connection', socket => {
socket.on("message", async data => {
  let result = await messageService.save(data)
  let chat = await messageService.getAll()
  socketServer.emit("messages", chat)
})
})


// if(cluster.isPrimary){
//   console.log("This is a primary process")
//   const processes = cpus().length
//   for (let i = 0; i < processes; i++) {
//     cluster.fork()
//   }
// }else {
//   console.log("worker")
// }
