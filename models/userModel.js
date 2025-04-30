import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
    },
    avatar: {
      type: String,
    },
    token: {
      type: String,
    },
  
    cartData: {
        type:Object,
        default:{}

    },
  
  },
  { timestamps: true,minimize:false }
);

const User = mongoose.model("User", userSchema);

export default User;