import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config'

const app = express();

app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json());

//routers
// import formdata from './routes/formdata.js';
import productroutes from './routes/products.js';
import payment_route from './routes/payment.js';

app.use('/api/products', productroutes);
// app.use('/api/user', formdata);
app.use('/', payment_route);

mongoose.connect(process.env.CONNECTION_STRING)
.then(() => {
    console.log("Mongoose Connected Succesfully");

    app.listen(process.env.PORT, () => {
        console.log(`Server run on port ${process.env.PORT}`);
    })
})

.catch((err) => {
    console.log(err)
})