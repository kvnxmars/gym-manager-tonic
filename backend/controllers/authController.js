const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User")

const JWT_SECRET = process.env.JWT_SECRET || "tonic.key";

class authController{
// ----------------------
// Signup
// ----------------------
static async signup(req, res) {
  try {
    //debug log
    console.log("Signup request body: ", req.body);

    const { studentNumber, firstName, lastName, email, password, role } = req.body;

    //check for email
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    //check if user already exist
    let existingUser;
    if (studentNumber) {
      existingUser = await User.findOne({
        $or: [{ email }, { studentNumber }]
      });
    }else {
      existingUser = await User.findOne( {email})
    }

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //determind user role
    const userRole = role === "admin" ? "admin" : "student";

    //create role object
    let newUser;

    //create user based
    if (userRole === "admin") {
      // -------- ADMIN SIGNUP --------
      newUser = new User({
        email,
        password: hashedPassword,
        role: "admin"
      });
    }else {
      if (!studentNumber || ! firstName || !lastName) {
        return res.status(400).json({
          message: "All fields required"
        });
      }

      newUser = new User({
        studentNumber,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "student"
      })
    }
  
    await newUser.save();

    console.log("User created successfully:", { 
      email, 
      role: newUser.role 
    });
  
      
   return res.status(201).json({ 
    message: `${userRole === "admin" ? "Admin" : "Student"} registered successfully`, 
    role: newUser.role
  });

  
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ 
      message: "Server error during signup", 
      error: err.message
    });
  }
}

// ----------------------
//  Login
// ----------------------
static async login(req, res){
  try {
    console.log("Login request body: ", req.body); //debug log

    const { studentNumber, email, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (!email && !studentNumber) {
        return res.status(400).json({ message: "Email or student number is required" });
      }


    let user = null;
    //let role = null;

    // Strategy: Try to identify user type based on what was provided
    if (email) {
      // If email is provided, check Admin first
      user = await User.findOne({ email });
    }else if (studentNumber) {
      user = await User.findOne({ studentNumber })
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
    const token = jwt.sign({ 
      id: user._id, 
      role: user.role 
    }, 
    JWT_SECRET, {
       expiresIn: "1h" 
      });

    // Return appropriate user data based on role
    const userData = user.rule === "admin"
    ? {
      id: user._id, 
      email: user.email 
      }
    : {
      studentNumber: user.studentNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };

    console.log("Login successful:", { email: user.email, role: user.role }); // DEBUG LOG

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      user: userData,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};
}
module.exports = authController;
