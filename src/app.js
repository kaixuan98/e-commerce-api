const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const itemRouter = require('./routers/item');


// call the express app
const app = express();
app.use(express.json());
app.use(userRouter);
app.use(itemRouter);

// specifiy port 
const port = process.env.PORT 

app.listen(port, ()=> {
    console.log(`Server listening on port ${port}`)
})

