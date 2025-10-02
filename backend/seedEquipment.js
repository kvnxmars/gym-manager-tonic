// backend/seedEquipment.js
const mongoose = require("mongoose");
const Equipment = require("./models/Equipment");

const connectionstring =
  "mongodb+srv://dbGenericUser:tonic-mongoose@fitnwu-cluster.nbdlox7.mongodb.net/fitnwu";

async function seed() {
  try {
    await mongoose.connect(connectionstring, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");

    // optional: remove old
    await Equipment.deleteMany({});

    const items = [
      { name: "Olympic Barbell", category: "Weights", quantity: 6, location: "Main Floor" },
      { name: "45kg Plates (set)", category: "Weights", quantity: 10, location: "Rack A" },
      { name: "Adjustable Bench", category: "Benches", quantity: 8, location: "Main Floor" },
      { name: "Squat Rack", category: "Machines", quantity: 4, location: "Strength Zone" },
      { name: "Cable Machine", category: "Machines", quantity: 2, location: "Strength Zone" },
      { name: "Treadmill", category: "Cardio", quantity: 6, location: "Cardio Zone" },
      { name: "Rowing Machine", category: "Cardio", quantity: 4, location: "Cardio Zone" },
      { name: "Kettlebell 16kg", category: "Weights", quantity: 10, location: "Kettlebell Rack" },
      { name: "Dumbbell Set 2-40kg", category: "Weights", quantity: 1, location: "Dumbbell Rack" },
    ];

    await Equipment.insertMany(items);
    console.log("✅ Seeded equipment:", items.length);
    process.exit(0);
  } catch (err) {
    console.error("Seeding equipment error:", err);
    process.exit(1);
  }
}

seed();
