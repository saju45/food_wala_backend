import cors from "cors";
import { config } from "dotenv";
import express from "express";
import connectCloudinary from "./config/cloudinary.js";
import connectDB from "./config/mongodb.js";

import productRouter from "./routes/productRoute.js";
import userRouter from "./routes/userRoute.js";

config();
const app=express();

connectDB();
connectCloudinary();
//middleware setup
app.use(express.json());
app.use(cors());

app.use("/users",userRouter);
app.use("/products",productRouter);

app.get("/",(req,res)=>{
    res.send("hello shanawaj hossain")
});

const port=process.env.PORT || 4000;

app.listen(port,()=>{
    console.log("app in running on port ",port);
    
})