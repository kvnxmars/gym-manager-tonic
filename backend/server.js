//import libraries: aaaplug


//basic server setup
const express = require('express');
const mongoose = require('mongoose'); // Add this line
const app = express();
const PORT = 9000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://dbGenericUser:tonic-mongoose@fitnwu-cluster.nbdlox7.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Import models (schemas)
const CheckIn = require('./models/CheckIns'); // Example: CheckIn model

//middleware to parse JSON bodies
app.use(express.json());

//app.get('/', (req,res) => res.send('API Running!'));
//app.use('/api/auth', require('./routes/auth')); //Auth routes

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//api/signup: kevin
/*app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;

    //Basic validation
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    //TODO: Add user to database (mocked here)
    res.status(201).json({ message: 'User signed up successfully.' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});*/

//api/login/: yoda
//api/logout/: yoda


