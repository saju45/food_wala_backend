import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();
const adminAuth=async(req,res,next)=>{
    try {
        const {token}=req.headers;
        if (!token) {
            return res.status(400).json({error:"Not authorize please login first"})
        }
        
        const token_decode=jwt.verify(token,process.env.JWT_SECRET);
        if (token_decode !==process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD) {
            return res.status(400).json({error:"Not authorize please login first"})
            
        }

        next();
        
    } catch (error) {
        console.log(error);
        return res.json({error:error.message})
        
    }
}

export default adminAuth;