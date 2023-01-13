const express = require('express');
require('./db/mongoose')

// call the express app
const app = express();
app.use(express.json());

// specifiy port 
const port = process.env.PORT 

app.listen(port, ()=> {
    console.log(`Server listening on port ${port}`)
})

