import User from "../models/userModel.js";

export const addToCart=async(req,res)=>{

    try {
        const {userId,itemId,size}=req.body;

        if (!userId || !itemId || !size) {
        return res.status(400).json({error:"All fields are required"})
        }

        const userData= await User.findById(userId);
        const cartData=userData.cartData;
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size]+=1;
            }else{
                cartData[itemId][size]=1;
 
            }
        }else{
            cartData[itemId]={};
            cartData[itemId][size]=1;  
     }
      await User.findByIdAndUpdate(userId,{cartData});
      res.status(201).json({message:"add to cart Successfully"
      });
        } catch (error) {
        return res.status(500).json({error:error.message })
    }
}

export const updateCart=async(req,res)=>{

    try {

        const {userId,itemId,size,quantity}=req.body;

        if (!userId || !itemId || !size || !quantity) {
        return res.status(400).json({error:"All fields are required"})
        }

        const userData= await User.findById(userId);
        const cartData=userData.cartData;

        cartData[itemId][size]=quantity;
        await User.findByIdAndUpdate(userId,{cartData})
        res.status(201).json({message:"cart data update Successfully"})
 
    } catch (error) {
       res.status(500).json({error:"There was a server site error"}) 
    }
}


export const getUserCart=async(req,res)=>{
    
    try {
        const {userId}=req.body;
        
        if (!userId) {
            return res.status(400).json({error:"UserId Required"})
        }
        const userData=await User.findById(userId);
        if (!userData) {
            return res.status(401).json({error:"User Not Found"})
        }
        const cartData=await userData.cartData;
       return res.status(200).json({cartData});
    } catch (error) {
        res.status(500).json({error:"There was a server site error"}) 
        
    }
}