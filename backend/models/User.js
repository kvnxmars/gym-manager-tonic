const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // For students only
  studentNumber: {
    type: String,
    sparse: true, // Allows null for non-students
    //unique: true,
  },
  
  firstName: {
    type: String,
    required: function() {
      return this.role === "student";
    }
  },
  
  lastName: {
    type: String,
    required: function() {
      return this.role === "student";
    }
  },
  
  // For all users
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  
  password: {
    type: String,
    required: true,
  },
  
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);