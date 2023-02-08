const express = require('express');
require('dotenv').config();
require('./db/mongoose');
const userRouter = require('./routers/user');
const itemRouter = require('./routers/item');
const cartRouter = require('./routers/cart');
// const orderRouter = require('./routers/order');

// call the express app
const app = express();
app.use(express.json());

// configure cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept,x-access-token, Authentication");
    next();
});

app.use(userRouter);
app.use(itemRouter);
app.use(cartRouter);
// app.use(orderRouter);

// specifiy port 
const port = process.env.PORT 

app.listen(port, ()=> {
    console.log(`Server listening on port ${port}`)
})

