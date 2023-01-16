const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name:{  // username 
        type:String,
        required: true,
        trim: true,
        lowercase: true
    },
    email:{
        type:String,
        required: true, 
        unique: true,
        lowercase: true, 
        validate(value){ // check whether the email is right format 
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type:String,
        required: true,
        minLength: 7, 
        trim: true,
        validate(value){ // make sure the password does not contain the word "password" 
            if(value.toLowerCase().includes('password')){
                throw new Error('password musn\'t contain password')
            }
        }
    },
    tokens: [{ // array of tkn that is generate by jwt - used to auth users
        token:{
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true // auto create a createdAt and updated at field in db
})

const User = mongoose.model('User', userSchema);
module.exports = User