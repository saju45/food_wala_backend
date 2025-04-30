import jwt from "jsonwebtoken";
import User from "../models/userModel";

export const authMiddlware = {
  verify: async (req, res, next) => {
    let token;

    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({ error: "Access Denied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ error: "User no longer exists" });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid Token" });
    }
  },
  authorizeRole: (role) => {
    return async (req, res, next) => {
      if (req.user.role !== role) {
        return res
          .status(403)
          .json({ error: "You are not authorized to perform this action" });
      }
      next();
    };
  },
};