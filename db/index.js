const mongoose = require('mongoose');

const { mongoDevURI } = require('../config/default.json');

const isProduction = process.env.NODE_ENV === 'production';
const MONGO_URI = process.env.MONGODB_URL || (!isProduction ? mongoDevURI : '');

if (!MONGO_URI) {
    throw new Error('MONGODB_URL is required when NODE_ENV=production');
}

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
