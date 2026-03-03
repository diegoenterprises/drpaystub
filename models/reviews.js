const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
    {
        product: {
            type: String,
            trim: true,
        },
        customer_name: {
            type: String,
            trim: true,
        },
        customer_email: {
            type: String,
            required: 'Email address is required',
            trim: true,
            lowercase: true,
        },
        description: {
            type: String,
            trim: true,
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
        },
    },
    { timestamps: true },
);

module.exports.ReviewModel = mongoose.model('review', ReviewSchema);
