// backend/seedDummyData.js
const mongoose = require("mongoose");
const Student = require("./models/Student");
const CheckIn = require("./models/CheckIns");

const connectionstring =
  "mongodb+srv://dbGenericUser:tonic-mongoose@fitnwu-cluster.nbdlox7.mongodb.net/fitnwu";

async function seed() {
  try {
    await mongoose.connect(connectionstring, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");

    // Clear old test data
    await Student.deleteMany({});
    await CheckIn.deleteMany({});

    // Insert dummy students
    const students = await Student.insertMany([
      {
        studentNumber: "20123456",
        name: { first: "Alice", last: "Johnson" },
        email: "alice@nwu.ac.za",
        password: "hashedpassword1",
      },
      {
        studentNumber: "20123457",
        name: { first: "Bob", last: "Smith" },
        email: "bob@nwu.ac.za",
        password: "hashedpassword2",
      },
      {
        studentNumber: "20123458",
        name: { first: "Charlie", last: "Mokoena" },
        email: "charlie@nwu.ac.za",
        password: "hashedpassword3",
      },
    ]);

    console.log("✅ Dummy students created:", students.length);

    // Insert dummy check-ins
    const checkins = await CheckIn.insertMany([
      {
        studentId: students[0]._id,
        checkInTime: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
        checkOutTime: null,
      },
      {
        studentId: students[1]._id,
        checkInTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hr ago
        checkOutTime: new Date(Date.now() - 1000 * 60 * 10), // left 10 min ago
      },
      {
        studentId: students[2]._id,
        checkInTime: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
        checkOutTime: null,
      },
    ]);

    console.log("✅ Dummy check-ins created:", checkins.length);
    console.log("🌱 Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
