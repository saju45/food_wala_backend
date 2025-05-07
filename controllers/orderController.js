import Stripe from "stripe";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

//global variables
const currency="usd";
const Delivery_Charges=20;

//stripe geteway
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);

export const placedOrder=async(req,res)=>{
    
    try {
        const {userId,items,amount,address}=req.body;

        if (!userId || !items || !amount || !address) {
            return res.status(400).json({error: "All Fields are required"})
        }
        const orderData={
            userId,
            items,
            amount,
            address,
            paymentMethod:"COD",
            payment:false,
            date:Date.now()
        }
        
        const newOrder=new Order(orderData);
        await newOrder.save();

        await User.findByIdAndUpdate(userId,{cartData:{}});
        res.status(201).json({message:"Order Placed"})
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message})
        
    }
}

export const placedOrderStripe=async(req,res)=>{
    
    try {
        const {userId,items,amount,address}=req.body;
        const {origin}=req.headers;
        const orderData={
            userId,
            items,
            amount,
            address,
            paymentMethod:"Stripe",
            payment:false,
            date:Date.now()
        }
        
        const newOrder=new Order(orderData);
        await newOrder.save();

        const line_items=items.map((item)=>({
            price_data:{
                currency:currency,
                product_data:{
                    name:item.name
                },
                unit_amount:item.price[item.size] *100 *277
            },
            quantity:item.quantity
        }));

        line_items.push({
            price_data:{
                currency:currency,
                product_data:{
                    name:"Delivery_Charges"
                },
                unit_amount:Delivery_Charges *100 *277
            },
            quantity:1
        });

        const seasion=await stripe.checkout.sessions.create({
            success_url:`${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode:"payment"
        });

        res.status(201).json({message:"Payment Success",seasion_url:seasion.url})     
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"There was an server site error"})
        
    }
}

export const verifyStripe=async(req,res)=>{
    
    try {
        const {orderId,success,userId}=req.body;

        if (success==="true") {
            await Order.findByIdAndUpdate(orderId,{payment:true});
            await User.findByIdAndUpdate(userId,{cartData:{}});
            res.json({success:true,})
        }else{
            await Order.findByIdAndDelete(orderId);
            res.json({success:false})
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message})
        
    }
}
export const updateStatus=async(req,res)=>{
    
    try {
        const {orderId,status}=req.body;
        const order=await Order.findByIdAndUpdate(orderId,{status})
        res.status(201).json({message:"Order status update successfully",order})
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"There was an server site error"})
        
    }
}

export const allOrders=async(req,res)=>{
    
    try {
        const orders=await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message})
        
    }
}


export const userdOrders=async(req,res)=>{
    
    try {
        const {userId}=req.body;
        const orders=await Order.find({userId});

        res.status(200).json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"There was an server site error"})
        
    }
}
