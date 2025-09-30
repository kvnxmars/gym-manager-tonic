// seed.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Load models
const Student = require("./models/Student");
const CheckIn = require("./models/CheckIns");

// MongoDB connection
const connectionString =
  "mongodb+srv://dbGenericUser:tonic-mongoose@fitnwu-cluster.nbdlox7.mongodb.net/fitnwu";

const seedData = async () => {
  try {
    await mongoose.connect(connectionString);

    console.log("✅ Connected to MongoDB...");

    // Clear old data
    await Student.deleteMany({});
    await CheckIn.deleteMany({});

    console.log("🗑️ Old data cleared");

    // Create students with hashed passwords
    const students = [
      {
        firstName: "John",
        lastName: "Doe",
        studentNumber: "12345",
        email: "john@example.com",
        password: await bcrypt.hash("password123", 10),
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        studentNumber: "67890",
        email: "jane@example.com",
        password: await bcrypt.hash("password123", 10),
      },
      {
        firstName: "Alice",
        lastName: "Brown",
        studentNumber: "11223",
        email: "alice@example.com",
        password: await bcrypt.hash("password123", 10),
      },
    ];

    const insertedStudents = await Student.insertMany(students);
    console.log("👩‍🎓 Students inserted:", insertedStudents.map(s => s.studentNumber));

    // Create a sample check-in for John Doe
    await CheckIn.create({
      studentId: insertedStudents[0]._id,
      checkInTime: new Date(),
      checkOutTime: null, // still active
    });

    console.log("📌 Sample check-in created for John Doe");

    mongoose.connection.close();
    console.log("✅ Database seeded and connection closed");
  } catch (err) {
    console.error("❌ Seeding error:", err);
    mongoose.connection.close();
  }
};

seedData();
