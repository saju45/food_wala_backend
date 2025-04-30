import express from "express";
import { adminLogin, login, logout, register } from "../controllers/userController.js";

const userRouter =express();

userRouter.post("/register",register);
userRouter.post("/login",login);
userRouter.post("/logout",logout);
userRouter.post("/adminLogin",adminLogin)


export default userRouter