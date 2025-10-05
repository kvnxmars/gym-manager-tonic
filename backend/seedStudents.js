// backend/seedStudents.js
const mongoose = require("mongoose");
const crypto = require("crypto");
const Student = require("./models/Student");
const CheckIn = require("./models/CheckIns");

const connectionstring = "mongodb+srv://dbGenericUser:tonic-mongoose@fitnwu-cluster.nbdlox7.mongodb.net/fitnwu";

async function seed() {
  try {
    await mongoose.connect(connectionstring, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ MongoDB connected");

    // optional: remove old students created by seeder only (BE CAREFUL!)
    // await Student.deleteMany({ email: /@example.com$/ });

    const students = [
      { studentNumber: "20100001", email: "alice@example.com", name: { first: "Alice", last: "Johnson" }, password: "pass123" },
      { studentNumber: "20100002", email: "bob@example.com", name: { first: "Bob", last: "Molefe" }, password: "pass123" },
      { studentNumber: "20100003", email: "carla@example.com", name: { first: "Carla", last: "Smith" }, password: "pass123" },
      { studentNumber: "20100004", email: "david@example.com", name: { first: "David", last: "Lee" }, password: "pass123" }
    ];

    for (const s of students) {
      const exists = await Student.findOne({ studentNumber: s.studentNumber });
      if (exists) {
        console.log("Skipping existing", s.studentNumber);
        continue;
      }
      // create unique QR token
      s.qrCode = crypto.randomUUID();
      const doc = new Student(s);
      await doc.save();
      console.log("Created:", s.studentNumber, "qr:", s.qrCode);
    }

    console.log("✅ Student seeding done");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
