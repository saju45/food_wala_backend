import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Object,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
        type:String,
        required:true,
    },
    date:{
        type:Number,
        
    },
    sizes:{
      type:Array,
    },
    popular:{type:Boolean},
    // stock: {
    //   type: Number,
    //   required: true,
    // },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String, required: true },
        rating: { type: Number, required: true, min: 0, max: 5 },
      },
    ],
  },

  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;