const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String }, 
  quantity: { type: Number, default: 1 },
  location: { type: String },
  notes: { type: String },
  status: { type: String, enum: ["available","broken","maintenance"], default: "available" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Equipment || mongoose.model("Equipment", equipmentSchema);
