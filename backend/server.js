
//import libraries
 
const connectionstring = "mongodb+srv://dbGenericUser:tonic-mongoose@fitnwu-cluster.nbdlox7.mongodb.net/";
const express = require("express");
const mongoose = require("mongoose");
const bcryot = require("bcryptjs"); //for password hashing
const cors = require("cors"); //to handle cross-origin requests



const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(connectionstring, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Test route
app.get("/", (req, res) => {
    res.send("Hello FIT@NWU backend is running 🚀");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});


//push changes to remote repo: aaa.plug

//api/login/: yoda
//api/logout/: yoda


