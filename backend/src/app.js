import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser'
import path from 'path'
import cors from "cors"


const app = express();

app.use(urlencoded({extended:true}))
app.use(json())
app.use(cookieParser());
app.use(express.static(path.resolve("public")))
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// routes
import userRouter from './routes/user.route.js'
import productRouter from './routes/product.route.js'

// user routes
app.use("/api/v1/user", userRouter)

// product routes
app.use("/api/v1/product", productRouter)



export {app}