const mongoose = require("mongoose");

// Helper regex for email validation
//const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Staff schema
const staffSchema = new mongoose.Schema({
  staffID: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: {
    first: { 
      type: String, 
      required: true 
    },
    last: { 
      type: String, 
      required: true 
    }
  },
  email: { 
    type: String, 
    required: true 
  },

  password: { 
    type: String, 
    required: true 
  },
  // hashed
  role: { type: String, default: "staff" }
});

module.exports = mongoose.model("Staff", staffSchema);
