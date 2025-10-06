const bcrypt = require("bcryptjs");
const CheckIn = require("../models/CheckIns");
const User = require("../models/User");

class StudentController {
// Get QR data
static async getQR (req, res) {
  try {
    const { studentNumber } = req.params;
    const student = await Student.findOne({ studentNumber });

    if (!student) return res.status(404).json({ message: "Student not found." });

    res.json({
      qrData: student.studentNumber,
      student: {
        name: `${student.name.first} ${student.name.last}`,
        studentNumber: student.studentNumber,
        email: student.email,
        membershipStatus: student.membershipStatus,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error generating QR." });
  }
};

// Get check-ins for a student
static async getCheckIns (req, res) {
  try {
    const { studentNumber } = req.params;
    const student = await User.findOne({ studentNumber });

    if (!student) return res.status(404).json({ message: "Student not found." });

    const checkIns = await CheckIn.find({ studentId: student._id })
      .sort({ checkInTime: -1 })
      .limit(50);

    res.json({ student: { studentNumber }, checkIns });
  } catch (err) {
    res.status(500).json({ message: "Error fetching check-ins." });
  }
}

// GET 

static async getStudentInfo (req, res) {
  try {
    //extract user ID from url 
    const {studentNumber} = req.params;

    console.log("Student number received:", studentNumber);

    // Validate studentNumber
    if (!studentNumber || studentNumber.length < 6) {
      
      return res.status(400).json({ message: "Invalid student number" });
    }

    //use mongoose to find the user
    const student = await User.findOne({
      studentNumber: studentNumber,
      role: "student"
    });

    //check if the user exists
    if(!student) {
      return res.status(404).json({ message: "user not found"});
    }

    //if the user is found, send info as json
    res.status(200).json({
      message: "Student retrieved successfully",
      student,
    });


  }catch (error) {
    res.status(500).json({
      message: "Server error while geyching user",
      error: error.message,
    });
  }
};

static async getAllUsers( req, res) {
  try {
      const profiles = await User.find();
      res.json(profiles);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

//update student info
static async updateStudentInfo (req, res) {
  try {

      const { studentNumber } = req.params;

      const updatedProfile = await User.findOneAndUpdate(
        { studentNumber },
        { ...req.body, updatedAt: new Date() },
        { new: true }
      );

      if (!updatedProfile) 
        return res.status(404).json({ error: "Profile not found" });

      res.json(updatedProfile);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
};

static async removeStudent (req, res) {
  try {

    const { studentNumber } = req.params;

      const deletedProfile = await User.findOneAndDelete(
        { studentNumber }
      );
      
      if (!deletedProfile) 
        return res.status(404).json({ error: "Profile not found" });

      res.json({ message: "Profile deleted successfully"});
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
};

static async updatePassword (req, res) {
  try {
    const { studentNumber } = req.params;
    const { oldPassword, newPassword } = req.body;

    const student = await User.findOne({ studentNumber });
    if (!student)
      return res.status(404).json({ message: "User not found." });

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, student.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect old password." });

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedPassword;
    await student.save();

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error updating password.", error: error.message });
  }
}
};
module.exports = StudentController;