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

// the schema has this method - used to generate auth token
userSchema.methods.generateAuthToken  = async function (){
    const user = this; // this method will be bind with userSchema and will get access of all the instances with this keyword
    const token = jwt.sign({ 
        _id: user._id.toString()
    }, process.env.JWT_SECRET);

    user.tokens = [...user.tokens, token];
    await user.save();
    return token
}

// static function to fetch a user based on their email and password - for login purpose 
userSchema.static.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if(!user){
        throw new Error('No such user')
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Incorrect Password')
    }

    return user
}

// pre middleware which run before a specific action 
// this function will be run before we save the user 
userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema);
module.exports = User