import express from "express";
import { allOrders, placedOrder, placedOrderStripe, updateStatus, userdOrders, verifyStripe } from "../controllers/orderController.js";
import adminAuth from "../middlewares/adminAuth.js";
import authUser from "../middlewares/auth.js";

const orderRoute=express.Router();

orderRoute.post("/list",adminAuth,allOrders);
orderRoute.post("/status",adminAuth,updateStatus);

orderRoute.post("/place",authUser,placedOrder);
orderRoute.post("/stripe",authUser,placedOrderStripe);
orderRoute.post("/verifyStripe",authUser,verifyStripe);

orderRoute.post("/userOrders",authUser,userdOrders);

export default orderRoute;