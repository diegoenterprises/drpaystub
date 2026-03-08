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
    // Full form data for EFW2 e-file generation
    formData: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("w2record", W2RecordSchema);
