const express = require("express")
const Order = require("../models/order")
const Cart = require("../models/cart")
const User = require("../models/user")
const Auth = require("../middleware/auth")


const router = new express.Router()

router.get('/orders', Auth, async(req, res) => {
    const owner = req.user._id;

    try{
        const order = await Order.find({owner:owner}).sort({date: -1});
        res.status(200).send(order); 
    }catch(error){
        res.status(500).send();
    }
})

router.post('/order/checkout', Auth, async(req,res) => {
    try{
        const owner = req.user._id;
        
        // find cart and user 
        let cart = await Cart.findOne({owner});
        let user = req.user

        if(cart){
            // add own payment api here 
            res.status(200).send({message: 'Order Recieved'})
        }else{
            res.status(400).send("no Cart found")
        }
    }catch(error){
        res.status(400).send('Checkout error');
    }
})

module.exports = router; 