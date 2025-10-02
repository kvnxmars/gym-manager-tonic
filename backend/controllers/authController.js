const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Admin = require("../models/Admin");

const JWT_SECRET = process.env.JWT_SECRET || "tonic.key";

class authController{
// ----------------------
// Signup
// ----------------------
static async signup(req, res) {
  try {
    const { studentNumber, firstName, lastName, email, password, role } = req.body;

    //check for email
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    if (role === "admin") {
      // -------- ADMIN SIGNUP --------
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin already exists" });
    }
  
   const hashedPassword = await bcrypt.hash(password, 10);
   const newAdmin = new Admin({ email, password: hashedPassword});
   await newAdmin.save();

   return res.status(201).json({ message: "Admin registered successfully", role: "admin "})

  }



    if (!studentNumber || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await Student.findOne({ studentNumber });
    if (existing) {
      return res.status(409).json({ message: "Student with this number already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const student = new Student({
      studentNumber,
      name: { first: firstName, last: lastName },
      email,
      password: hashed,
    });

    await student.save();
    res.status(201).json({ message: "Student registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// ----------------------
// Student Login
// ----------------------
static async studentLogin(req, res){
  try {
    const { studentNumber, email, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    let user = null;
    let role = null;

    // Strategy: Try to identify user type based on what was provided
    if (email) {
      // If email is provided, check Admin first
      user = await Admin.findOne({ email });
      if (user) {
        role = "admin";
      } else {
        // If no admin found, check if a student has this email
        user = await Student.findOne({ email });
        if (user) role = "student";
      }
    } else if (studentNumber) {
      // If studentNumber is provided, must be a student
      user = await Student.findOne({ studentNumber });
      if (user) role = "student";
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: "1h" });

    // Return appropriate user data based on role
    res.json({
      message: "Login successful",
      token,
      role,
      user: role === "admin"
        ? { email: user.email }
        : { studentNumber: user.studentNumber, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};
}
module.exports = authController;
// ----------------------
// Staff Login
// ----------------------
/*exports.staffLogin = async (req, res) => {
  try {
    const { staffNumber, password } = req.body;

    if (!staffNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const staff = await Staff.findOne({ staffNumber });
    if (!staff) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // ✅ Create JWT
    const token = jwt.sign({ id: staff._id, role: "staff" }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login successful!",
      token,
      staff: {
        id: staff._id,
        staffNumber: staff.staffNumber,
        name: staff.name,
        email: staff.email,
      },
    });
  } catch (error) {
    console.error("Staff login error:", error);
    res.status(500).json({ message: "An error occurred during login." });
  }
};*/
