const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const StudentSchema = new mongoose.Schema({
  studentNumber: {
    type: String,
    required: [true, 'Student number is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  // If you need these, they should be in the schema
  name: {
    first: String,
    last: String,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
});

// Pre-save hook to hash the password
StudentSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Export the model
const Student = mongoose.model('Student', StudentSchema);

module.exports = Student; // Export the model directly