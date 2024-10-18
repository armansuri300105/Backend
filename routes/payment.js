import express from 'express'

const router = express.Router();

import {CreateOrder} from '../controller/payment.controller.js'
import {verifyPayment} from '../controller/payment.controller.js'
router.post('/createOrder', CreateOrder);
router.post('/verifyPayment', verifyPayment);

export default router