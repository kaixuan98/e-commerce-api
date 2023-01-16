const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URL);
const database = mongoose.connection
database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})


// loading mongoose and connecting with the mongoose url in env file 