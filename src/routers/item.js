const express = required('express');
const Item = require('../models/item');
const Auth = require('../middleware/auth');

const router = new express.Router();

// create a new item 
router.post('/items/create', Auth, async(req,res) => {
    try{
        const newItem = new Item({
            ...req.body,
            owner: req.user._id
        });
        await newItem.save();
        res.status(201).send(newItem);
    }catch(error){
        res.status(400).send({message: 'error'});
    }
})

// fetch an item 
// TODO : is item out of stock 
router.get('/items/:id', async(req, res)=> {
    try{
        const item = await Item.findOne({_id: req.params.id});
        if(!item){
            res.status(404).send({error: 'Item not found'});
        }
        res.status(200).send(item);
    }catch(error){
        res.status(400).send(error);
    }
})

// fetch all items 
router.get('/items/all', async(req, res)=> {
    try{
        const items = await Item.find({});  // provide an empty object to find all 
        res.status(200).send(items)
    }catch(error){
        res.status(400).send(error);
    }
})

// fetch all items for a category - for filter data 
router.get('/items/:category', async(req,res)=> {
    try{
        const itemsInCategory = await Item.find({ category: req.params.category});
        res.status(200).send(itemsInCategory)
    }catch(error){
        res.status(400).send(error);
    }
})

//TODO : pagination 

// update an item 
router.patch('/items/:id', Auth, async(req,res) => {
    // get the updates vlaues from the body 
    const updates = Object.keys(req.body); 
    const allowedUpdates = ['name', 'descripton', 'category', 'price'];

    // make sure that the updates are allowed 
    const isValidOperation = updates.every( (update) => allowedUpdates.includes(update));
    if(!isValidOperation){
        return res.status(400).send({error: 'invalid updates'});
    }

    // then started to update and send to the database
    try{
        const item = await Item.findOne( {_id: req.params.id});

        if(!item){
            return res.status(404).send()
        }
        updates.forEach( (update) => item[update] = req.body[update]);
        await item.save();
        res.send(item)
    }catch(error){
        res.status(400).send(error)
    }
})

// delete an item 
router.delete('/items/:id', Auth, async(req, res) => {
    try{
        const deletedItem = await Item.findOneAndDelete({ _id: req.params.id});
        if(!deletedItem){
            res.status(404).send({error: 'Item not found'})
        }
        res.send(deletedItem);
    }catch(error){
        res.status(400).send(error)
    }
})

module.exports = router; 