// server.js - Clean working version
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();

// Middleware - MUST be before routes
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection string
const connectionstring = "mongodb+srv://dbGenericUser:tonic-mongoose@fitnwu-cluster.nbdlox7.mongodb.net/fitnwu";

// Connect to MongoDB
mongoose.connect(connectionstring, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ MongoDB connected");
}).catch(err => {
    console.error("❌ MongoDB error:", err);
});

// Import models
const Student = require('./models/Student');
const CheckIn = require('./models/CheckIns');

// Test route
app.get("/", (req, res) => {
    res.json({ message: "Hello FIT@NWU backend is running 🚀" });
});

// Test endpoint to check if JSON parsing works
app.post("/api/test", (req, res) => {
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    res.json({ 
        received: req.body,
        message: "Test successful" 
    });
});

// Register a new student
app.post("/api/signup", async (req, res) => {
    try {
        console.log("=== SIGNUP REQUEST ===");
        console.log("Headers:", req.headers);
        console.log("Body:", req.body);
        console.log("Body type:", typeof req.body);
        
        // Check if req.body exists
        if (!req.body) {
            return res.status(400).json({ message: "No request body received" });
        }

        const { studentNumber, firstName, lastName, email, password } = req.body;

        console.log("Extracted values:", { studentNumber, firstName, lastName, email, password });

        // Basic validation
        if (!studentNumber || !password) {
            return res.status(400).json({ 
                message: "Student number and password are required.",
                received: { studentNumber, password }
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }

        // Check if student already exists
        const existingStudent = await Student.findOne({ studentNumber });
        
        if (existingStudent) {
            return res.status(409).json({ 
                message: "Student with this student number already exists." 
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create student data
        const studentData = {
            studentNumber,
            password: hashedPassword,
        };

        // Add optional fields
        if (firstName || lastName) {
            studentData.name = {};
            if (firstName) studentData.name.first = firstName;
            if (lastName) studentData.name.last = lastName;
        }

        if (email) {
            studentData.email = email;
        }

        console.log("Creating student with data:", studentData);

        const newStudent = new Student(studentData);
        await newStudent.save();
        
        console.log("Student created successfully");
        res.status(201).json({ message: "Student registered successfully." });

    } catch (error) {
        console.error("Registration error:", error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: "An error occurred during registration." });
    }
});

// Login a student
app.post("/api/login", async (req, res) => {
    try {
        const { studentNumber, password } = req.body;

        if (!studentNumber || !password) {
            return res.status(400).json({ message: "Student number and password are required." });
        }

        const student = await Student.findOne({ studentNumber });
        if (!student) {
            return res.status(401).json({ message: "Invalid student number or password." });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid student number or password." });
        }

        res.status(200).json({ 
            message: "Login successful!",
            student: {
                id: student._id,
                studentNumber: student.studentNumber,
                name: student.name,
                email: student.email,
                membershipStatus: student.membershipStatus
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "An error occurred during login." });
    }
});

// Check-in with QR code
app.post("/api/checkin", async (req, res) => {
    try {
        const { qrData, studentNumber } = req.body;

        let finalStudentNumber = studentNumber;
        
        if (qrData) {
            try {
                if (qrData.startsWith('{')) {
                    const qrInfo = JSON.parse(qrData);
                    finalStudentNumber = qrInfo.studentNumber;
                } else {
                    finalStudentNumber = qrData.trim();
                }
            } catch (parseError) {
                return res.status(400).json({ message: "Invalid QR code format." });
            }
        }

        if (!finalStudentNumber) {
            return res.status(400).json({ message: "Student number is required." });
        }

        const student = await Student.findOne({ studentNumber: finalStudentNumber });
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        const activeCheckIn = await CheckIn.findOne({ 
            studentId: student._id,
            checkOutTime: null 
        });

        if (activeCheckIn) {
            return res.status(400).json({ 
                message: "Student is already checked in.", 
                checkInTime: activeCheckIn.checkInTime,
                student: {
                    name: student.name ? `${student.name.first || ''} ${student.name.last || ''}`.trim() : 'Unknown',
                    studentNumber: student.studentNumber
                }
            });
        }

        const checkIn = new CheckIn({
            studentId: student._id,
            checkInTime: new Date(),
            checkOutTime: null
        });

        await checkIn.save();
        
        res.status(201).json({ 
            message: "Check-in successful!", 
            checkIn: {
                id: checkIn._id,
                checkInTime: checkIn.checkInTime
            },
            student: {
                name: student.name ? `${student.name.first || ''} ${student.name.last || ''}`.trim() : 'Unknown',
                studentNumber: student.studentNumber,
                email: student.email
            }
        });

    } catch (error) {
        console.error("Check-in error:", error);
        res.status(500).json({ message: "An error occurred during check-in." });
    }
});

// Check-out with QR code
app.post("/api/checkout", async (req, res) => {
    try {
        const { qrData, studentNumber } = req.body;

        let finalStudentNumber = studentNumber;
        
        if (qrData) {
            try {
                if (qrData.startsWith('{')) {
                    const qrInfo = JSON.parse(qrData);
                    finalStudentNumber = qrInfo.studentNumber;
                } else {
                    finalStudentNumber = qrData.trim();
                }
            } catch (parseError) {
                return res.status(400).json({ message: "Invalid QR code format." });
            }
        }

        if (!finalStudentNumber) {
            return res.status(400).json({ message: "Student number is required." });
        }

        const student = await Student.findOne({ studentNumber: finalStudentNumber });
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        const checkIn = await CheckIn.findOne({
            studentId: student._id,
            checkOutTime: null
        });

        if (!checkIn) {
            return res.status(404).json({ 
                message: "No active check-in found for this student.",
                student: {
                    name: student.name ? `${student.name.first || ''} ${student.name.last || ''}`.trim() : 'Unknown',
                    studentNumber: student.studentNumber
                }
            });
        }

        checkIn.checkOutTime = new Date();
        await checkIn.save();

        const durationMinutes = Math.round((checkIn.checkOutTime - checkIn.checkInTime) / (1000 * 60));

        res.status(200).json({ 
            message: "Check-out successful!", 
            checkIn: {
                id: checkIn._id,
                checkInTime: checkIn.checkInTime,
                checkOutTime: checkIn.checkOutTime,
                durationMinutes: durationMinutes
            },
            student: {
                name: student.name ? `${student.name.first || ''} ${student.name.last || ''}`.trim() : 'Unknown',
                studentNumber: student.studentNumber,
                email: student.email
            }
        });

    } catch (error) {
        console.error("Check-out error:", error);
        res.status(500).json({ message: "An error occurred during check-out." });
    }
});

// Get student's QR code data
app.get("/api/student/qr/:studentNumber", async (req, res) => {
    try {
        const { studentNumber } = req.params;

        const student = await Student.findOne({ studentNumber });
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        res.status(200).json({ 
            qrData: student.studentNumber,
            student: {
                name: student.name ? `${student.name.first || ''} ${student.name.last || ''}`.trim() : 'Unknown',
                studentNumber: student.studentNumber,
                email: student.email,
                membershipStatus: student.membershipStatus
            }
        });

    } catch (error) {
        console.error("Generate QR error:", error);
        res.status(500).json({ message: "An error occurred while generating QR data." });
    }
});

// Get gym occupancy
app.get("/api/gym/occupancy", async (req, res) => {
    try {
        const activeCount = await CheckIn.countDocuments({ checkOutTime: null });
        res.status(200).json({ 
            currentOccupancy: activeCount,
            lastUpdated: new Date()
        });
    } catch (error) {
        console.error("Get occupancy error:", error);
        res.status(500).json({ message: "An error occurred while fetching gym occupancy." });
    }
});

// Get student's check-in history
app.get("/api/checkins/:studentNumber", async (req, res) => {
    try {
        const { studentNumber } = req.params;

        const student = await Student.findOne({ studentNumber });
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        const checkIns = await CheckIn.find({ studentId: student._id })
            .sort({ checkInTime: -1 })
            .limit(50);

        const checkInsWithDuration = checkIns.map(checkIn => ({
            _id: checkIn._id,
            checkInTime: checkIn.checkInTime,
            checkOutTime: checkIn.checkOutTime,
            duration: checkIn.checkOutTime ? 
                Math.round((checkIn.checkOutTime - checkIn.checkInTime) / (1000 * 60)) : 
                null,
            isActive: !checkIn.checkOutTime,
            createdAt: checkIn.createdAt
        }));

        res.status(200).json({ 
            student: {
                name: student.name ? `${student.name.first || ''} ${student.name.last || ''}`.trim() : 'Unknown',
                studentNumber: student.studentNumber
            },
            checkIns: checkInsWithDuration 
        });

    } catch (error) {
        console.error("Get check-ins error:", error);
        res.status(500).json({ message: "An error occurred while fetching check-ins." });
    }
});

// Logout
app.post("/api/logout", (req, res) => {
    res.status(200).json({ message: "Logout successful!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ message: "Internal server error" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Endpoint not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});