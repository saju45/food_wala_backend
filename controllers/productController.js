import { v2 as cloudinary } from "cloudinary";
import Product from "../models/productModel.js";

export const listProduct = async (req, res) => {
 
    try {
        const products=await Product.find({});
        return res.status(200).json({products});
    } catch (error) {
        res.status(500).json({ error: error.message });

    }
};
;

export const singleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


// Add new product

export const addProduct = async (req, res) => {
    try {
      const { name, prices, category, description ,popular} =
        req.body;
    
      if (
        !name ||
        !prices ||
        !category ||
        !description ||
        !popular

      ) {
        return res.status(400).json({ error: "All fields are required" });
      }
    
      if (!req.file) {
        return res.status(400).json({ error: "Please upload a product image" });
      }
  
      const imageUrl=await cloudinary.uploader.upload(req.file.path,{resource_type:"image"}).then((res)=>res.secure_url);

      const parsedprices=JSON.parse(prices);
      const price=parsedprices.reduce((acc,curr)=>{
        acc[curr.size]=Number(curr.price);

        return acc;
      },{});

      const sizes=parsedprices.map((item)=>item.size)
      const newProduct = new Product({
        name,
        price,
        category,
        description,
        popular,
        sizes,
        image: imageUrl,
        date:Date.now()
      });
  
      await newProduct.save();
      res
        .status(201)
        .json({ message: "product add successfully", product: newProduct });
    } catch (error) {
      console.log("errror : ");
        res.status(500).json({ error: error.message });
    }
  };
  

  //remove item
export const removeProduct=async(req,res)=>{

    try {
        const product=await Product.findByIdAndDelete(req.params.id);

       res.status(201).json({message:"Product delete Succes"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });

    }
}

export const updateProduct = async (req, res) => {
  
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "pleease provide productid" });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ error: "product not found" });
    }

    res.status(200).json({ message: `${product.name} deleted successfully` });
  } catch (error) {
    console.log(error);
    res.status(500).json("There was an error in server side ");
  }
};