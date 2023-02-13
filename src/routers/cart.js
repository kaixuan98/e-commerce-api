const express = require("express");
const Cart = require('../models/cart'); 
const Item = require('../models/item');
const Auth = require('../middleware/auth');

const router = new express.Router();

// get cart 
router.get('/cart', Auth, async(req,res) => {
    const owner = req.user._id; 
    try{
        const cart = await Cart.findOne({owner});
        if(cart && cart.items.length > 0){
            res.status(200).send(cart);
        }else{
            res.send({message: "There is nothing in your bag yet!"})
        }
    }catch(error){
        res.status(500).send();
    }
});

// create cart 
router.post("/cart", Auth, async(req,res)=> {
    const owner = req.user._id; // get the owner of the cart with user id
    const { itemId, quantity } = req.body;

    try{
        const cart = await Cart.findOne({owner});  // find the cart in cart model collection 
        const item = await Item.findOne({_id: itemId}); // find the item from the items 

        if(!item){ // no such items 
            res.status(404).send({message: "item not found"});
            return;
        }

        const price = item.price; 
        const name = item.name;

        if(cart){ // found a cart, add it to the cart and recalculate the bill 
            const itemIndex = cart.items.findIndex( (item) => item.itemId === itemId);

            if(itemIndex > -1){ // product did exsist in the cart already
                let product = cart.items[itemIndex];
                product.quantity = quantity;
                cart.bill = cart.items.reduce( (acc,curr) => {
                    return acc + curr.quantity * curr.price;
                },0)
                await cart.save();
                res.status(200).send(cart)
            }else{ // does not exsists in the cart still ned to be aadded
                cart.items.push(
                    {itemId: itemId, name, quantity, price}
                )
                cart.bill = cart.items.reduce( (acc,curr) => {
                    return acc + curr.quantity * curr.price;
                },0)
                await cart.save();
                res.status(200).send(cart)
            }
        }else{ // no cart, add that single item to cart 
            const newCart = await Cart.create({
                owner,
                items:[{itemId: itemId, name, quantity, price}],
                bill: quantity * price,
            })
            return res.status(201).send(newCart);
        }
    }catch(error){
        console.log(error)
        res.status(500).send("Cart Error")
    }
});

// remove item in the cart 
router.delete("/cart/", Auth, async(req, res)=> {
    const owner = req.user._id;

    const itemId = req.query.itemId;

    try{
        let cart = await Cart.findOne({owner});
        const itemIndex = cart.items.findIndex( (item) => item.itemId === itemId);

        if(itemIndex > -1 ){ // there is items in the cart 
            let item = cart.items[itemIndex]; 
            cart.bill -= item.quantity * item.price;
            if(cart.bill  < 0){
                cart.bill = 0; 
            }
            cart.items.splice(itemIndex, 1);
            cart.bill = cart.items.reduce( (acc, curr) => {
                return acc + curr.quantity * curr.price;
            },0)
            cart = await cart.save();
            res.status(200).send(cart);
        }else{
            res.status(404).send('item not found');
        }
    }catch(error){
        console.log(error);
        res.status(400).send();
    }
});

module.exports = router; 