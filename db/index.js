const mongoose = require('mongoose');

const { mongoDevURI, mongoProdURI } = require('../config/default.json');

// Use env var first, then Atlas prod URI, then local dev URI as last resort
const MONGO_URI = process.env.MONGODB_URL || mongoProdURI || mongoDevURI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB is connected!');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        console.error('App will start without DB — retrying in 10s...');
        setTimeout(connectDB, 10000);
    }
};

module.exports = connectDB;
