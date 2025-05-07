import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();
const authUser=async(req,res,next)=>{

    try {
        const {token}=req.headers;
        if (!token) {
            return res.status(400).json({error:"Not authorize please login again"})
        }
        
        const token_decode=jwt.verify(token,process.env.JWT_SECRET);
        
        req.body.userId=token_decode.id;

        next();
        
    } catch (error) {
        console.log(error);
        return res.json({error:error.message})
        
    }
}

export default authUser;