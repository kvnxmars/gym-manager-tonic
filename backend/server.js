
//import libraries
 

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); //for password hashing
const cors = require("cors"); //to handle cross-origin requests



const app = express();
app.use(express.json());
app.use((cors())); //Use CORS middleware

// MongoDB connection string
const connectionstring = "mongodb+srv://dbGenericUser:tonic-mongoose@fitnwu-cluster.nbdlox7.mongodb.net/";

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


//push changes

//api/login/: yoda
app.post("/api/login",async (req,res)=> {
    const {studentNumber,password}=req.body;

    //Find use by student number
    const user = await UserActivation.findOne({studentNumber});
    if(!user) {
        return res.status(400).json({message:"Invalid student number or password"});
    }

    ///Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) {
        return res.status(400).json({message:"Invalid student number or password"});
    }
}
//api/logout/: yoda


