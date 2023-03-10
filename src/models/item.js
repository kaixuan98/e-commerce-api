const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const itemSchema = new mongoose.Schema({
    owner:{
        type: ObjectID, 
        required: true,
        ref: 'User' // is pointing to which models we want the id from - who created this object
    },
    name: {
        type: String, 
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    category: {
        type: String,
    },
    humidity:{
        type:String
    },
    sunlight:{
        type:String
    },
    price:{
        type: Number,
        required: true
    }
},{
    timestamps: true
})

const Item = mongoose.model('Item', itemSchema);
module.exports = Item

