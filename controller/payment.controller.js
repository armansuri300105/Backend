import Razorpay from 'razorpay';
import { Product_info } from "../models/products.js";
import { ObjectId } from 'mongodb';
import { collection } from "../models/formdata.js";
import crypto from 'crypto'
import twilio from 'twilio';
import 'dotenv/config'

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY
});

let OrderData;
export const CreateOrder =  async (req, res) => {
    const {email, number, name, pin, address, area, Landmark, city, state, products, TotalBill} = req.body;
    OrderData = {
        Email:email,
        Number:number,
        Name:name,
        Zipcode: pin,
        Address: address,
        Area: area,
        LandMark: Landmark,
        City: city,
        State: state,
        products: products,
        TotalBill: TotalBill
    }

    let totalAmount = 0;
    for (const item of products) {
        const product = await Product_info.findOne({ _id: new ObjectId(item.ProductId) });
        if (!product) return res.status(400).json({ message: `Product not found for ID ${item.ProductId}` });
        totalAmount += product.price * item.ProductQuantity;
    }

    const orderOptions = {
        amount: totalAmount*100,
        currency: 'INR',
        receipt: 'order_rcptid_11'
    };

    try {
        const order = await instance.orders.create(orderOptions);
        res.json({
        success: true,
        key_id: process.env.RAZORPAY_ID_KEY,
        amount: order.amount,
        order_id: order.id,
        product_name: OrderData.products[0].ProductName,
        description: "Sample Product Description",
        contact: number,
        name: name,
        email: email
        });
    } catch (error) {
        res.json({ success: false, msg: "Order creation failed", error: error.message });
    }
};

export const verifyPayment =  async (req, res) => {
  const { payment_id, order_id, signature } = req.body;

  const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY);
  shasum.update(order_id + "|" + payment_id);
  const generated_signature = shasum.digest('hex');

  if (generated_signature === signature) {
    console.log(`original signature: ${signature}`);
    console.log(`generated signature: ${generated_signature}`);
    try {
        const newOrder = new collection(OrderData);
        await newOrder.save();
        client.messages
          .create({
              body: `Congratulation! Your Order of ${OrderData.products[0].ProductName} of total billing of ₹${OrderData.TotalBill} is successfully placed.`,
              from: 'whatsapp:+14155238886',
              to: `whatsapp:+91${OrderData.Number}`
          })
          .then(message => console.log(message.sid))
        return res.status(200).json({ success: true,  message: "Order saved successfully" });
    } catch (error) {
        console.error('Error saving order:', error);
        return res.status(500).json({ message: 'Error saving order', error });
    }
  } else {
    return res.json({ success: false });
  }
};