const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const cartSchema = new mongoose.Schema({
    owner:{ // who own this cart 
        type: ObjectID,
        required: true,
        ref: 'User'
    },
    // items that added into the cart, each item is an object 
    items: [
        {
            itemId: {
                type: String, // suppose to be objectid because the front end passed just string id so this is a string instead of ObjectID
                ref: 'Item',
                required: true
            },
            name: String,
            quantity:{
                type: Number,
                required: true,
                min: 1,
                default : 1 
            },
            price: Number
    }],
    bill:{
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
})  

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart; 