const bcrypt = require('bcryptjs');

// Replace 'your_initial_password' with the actual password
const password = 'Admin123'; 

// Generate the hash
bcrypt.hash(password, 10).then(hash => {
    console.log("Your Hashed Password:");
    console.log(hash);
    // Copy the output hash
});
// This will output a long string starting with $2a$ or $2b$