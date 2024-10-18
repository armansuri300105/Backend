import express from 'express'
import { Product_info } from '../models/products.js'
import {v2 as cloudinary} from 'cloudinary'
import pLimit from 'p-limit';

const router = express.Router();
cloudinary.config({
    cloud_name:process.env.cloudinary_Config_Cloud_Name,
    api_key:process.env.cloudinary_Config_api_key,
    api_secret:process.env.cloudinary_Config_api_secret
});

router.get('/test', (req,res) => {
    res.send({mesasge: "data sent", success: true});
})

router.get('/', async (req, res) => {
    const products_list = await Product_info.find();
    
    if (products_list.length === 0) {
        return res.status(404).json({ success: false, message: "No products found." });
    }
    res.send(products_list);
});

router.post('/create', async (req,res) => {
    const limit = pLimit(2);
    let uploadimages;
    try {
        uploadimages = req.body.image.map((image)  => {
            return limit(async () => {
                return await cloudinary.uploader.upload(image);
            });
        })
    } catch (error) {
        console.error(`Failed to upload ${image}:`, error);
        throw error;
    }
    let imageurl;
    const upload = await Promise.all(uploadimages);
    try {
        imageurl = upload.map((img) => {
            return img.secure_url;
        })
    } catch (error) {
        console.log(`image can't we converted in url`, error);
        throw error;
    }
    let product = new Product_info({
        id:req.body.id,
        name:req.body.name,
        image:imageurl,
        price:req.body.price
    })
    
    if (!product){
        console.error("Product not uploaded\n");
    }

    product = await product.save();
    res.status(201).json(product);
})

export default router;