import { config } from "dotenv";
import mongoose from "mongoose";

config();

const connectDB=async()=>{

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(" ✔ database Connected");
        
    } catch (error) {
        console.log("database connection fail ",error.message);
        
    }
}


export default connectDB;