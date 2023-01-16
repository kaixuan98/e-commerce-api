// handle user routes - signin , signup and logout 

const express = require('express');
const User = require('../models/user');
const Auth = require('../middleware/auth');

const router = new express.Router(); 

// signup 
router.post('/users/register', async (req,res) => {
    const user = new User(req.body); // the form will send in request as in body 
    try{
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user , token});
    }catch(error){
        res.status(400).send(error)
    }
})

// login user 
router.post('/users/login', async(req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({user,token})
    }catch(error){
        console.log(error)
        res.status(400).send(error)
    }
})

// logout - protected route where only a user that is auth can logout ( need to know whether the user had loggin or not)
// middleware - need a token from frontend , verify this tokem , add the user to the request body 
// only log out one session 
router.post('/users/logout', Auth, async(req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter( (token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(error){
        res.status(500).send()
    }
})

// logout all devices 
router.post('/users/logoutAll', Auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }catch(error){
        res.status(500).send();
    }
})

module.exports = router
