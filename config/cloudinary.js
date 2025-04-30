import { v2 as cloudinary } from 'cloudinary';
import { config } from "dotenv";

config();

const connectCloudinary=async()=> {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLDN_NAME, 
        api_key: process.env.CLDN_API_KEY, 
        api_secret: process.env.CLDN_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

    console.log("connect Cloudinary");
    
   
};

export default connectCloudinary;
