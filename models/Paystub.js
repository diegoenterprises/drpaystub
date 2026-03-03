const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaystubSchema = new mongoose.Schema(
  {
    params: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

//indexing done to make querying fast
module.exports = mongoose.model("paystub", PaystubSchema);
