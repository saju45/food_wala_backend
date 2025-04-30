import express from "express";
import { addProduct, listProduct, removeProduct, singleProduct } from "../controllers/productController.js";
import adminAuth from "../middlewares/adminAuth.js";
import upload from "../middlewares/multer.js";

const productRouter =express();

productRouter.post("/add",adminAuth,upload.single("image"),addProduct);
productRouter.get("/list",listProduct);
productRouter.get("/single/:id",singleProduct);
productRouter.delete("/remove/:id",adminAuth,removeProduct);


export default productRouter