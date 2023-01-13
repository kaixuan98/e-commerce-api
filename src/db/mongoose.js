const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
})

// loading mongoose and connecting with the mongoose url in env file 