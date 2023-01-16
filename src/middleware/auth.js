const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async(req, res, next) => {
    try{
        // getting the token from request header ( send fromt the front end)
        const token = req.header('Authorization').replace('Bearer', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // if the token exists then we can get the user id 
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token}); // find the user using the id and tokem

        if(!user){ // if no user, the error
            throw new Error;
        }

        // attach the iser and token to the request
        req.token = token 
        req.user = user 
        next()
    }catch(error){
        res.status(401).send({error: "Authentication required"})
    }
}

module.exports = auth
