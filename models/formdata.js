import mongoose from "mongoose";

const data = new mongoose.Schema({
    Email: String,
    Number: Number,
    Name: String,
    Zipcode: Number,
    Address: String,
    Area: String,
    LandMark: String,
    City: String,
    State: String,
    products: [{
        ProductId:String,
        ProductName: String,
        ProductPrice: Number,
        ProductQuantity: Number,
        ProductTotalCost: Number,
        ProductImage: String
    }],
    TotalBill:Number
})

export const collection = mongoose.model("collection", data);