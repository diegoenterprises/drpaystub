const mongoose = require("mongoose");

const W2RecordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    employerName: String,
    employerEIN: String,
    employeeFirstName: String,
    employeeLastName: String,
    employeeSSN: String,
    taxYear: String,
    box1: String,
    box2: String,
    state1: String,
    pdfFile: String,
    zipFile: String,
    filename: String,
    paymentStatus: { type: String, enum: ["success", "pending"], default: "success" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("w2record", W2RecordSchema);
