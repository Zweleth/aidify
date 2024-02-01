const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 6000;
const SECRET_KEY = 'your_secret_key'; // Change this with a secure secret key

// Create SQLite database and table
const db = new sqlite3.Database('./aidify.db');
// db.run('CREATE TABLE users (user_id char(36) NOT NULL DEFAULT (uuid()) UNIQUE PRIMARY KEY, username TEXT NOT NULL, password TEXT NOT NULL)');

// Middleware
app.use(bodyParser.json());

// Routes
//users table
//=====================================================================================================================================

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (user) {
            return res.status(500).json({ error: 'Username already taken' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        db.run('INSERT INTO users (username, password) VALUES (?,?)', [username, hashedPassword], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to register user' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    })


    // Hash the password

});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Retrieve user from the database
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate user' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid username' });
        }

        // Compare the provided password with the hashed password from the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ token });
    });
});

// Protected route example
app.get('/cases', authenticateToken, (req, res) => {

    db.get('SELECT * FROM cases', async (err, cases) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate user' });
        }

        if (!cases) {
            return res.status(401).json({ error: 'There are no support cases' });
        }
        if (cases) {
            res.status(201).json({cases});
        }

    });
    
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        req.user = user;
        next();
    });
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});