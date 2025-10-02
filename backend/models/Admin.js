const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Remove or make username optional so backend doesn't complain
    username: { type: String, required: false },
    role: { type: String, default: "admin" } // helps with redirects
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminSchema);
