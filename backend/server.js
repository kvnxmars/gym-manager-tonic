//basic server setup
const express = require('express');
const app = express();
const PORT = 3000;

//middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req,res) => res.send('API Running!'));
app.use('/api/auth', require('./routes/auth')); //Auth routes

app.listen(PORT, () => console.log('Server running on port ${PORT}'));

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


