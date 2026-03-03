const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StubSchema = new mongoose.Schema(
    {
        "customer_name": {
            type: String,
            trim: true,
        },
        "email": {
            type: String,
            required: 'Email address is required',
            trim: true,
            lowercase: true
        }
    },
    { timestamps: true }
  );

//indexing done to make querying fast 
StubSchema.index({ '_id': 1 });
module.exports = Order = mongoose.model("stub", StubSchema);
