import mongoose from "mongoose";

const P_Data = new mongoose.Schema({
    id:Number,
    name:String,
    image:[String],
    price:Number
})

export const Product_info = mongoose.model("Product_info", P_Data);