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

    db.all('SELECT t1.*, COUNT(t2.case_id) AS num_of_replies FROM cases t1 LEFT JOIN comments t2 ON t1.case_id = t2.case_id GROUP BY t1.case_id', (err, data) => {

        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate user' });
        }

        if (!data) {
            return res.status(401).json({ error: 'There are no support cases' });
        }
        if (data) {
            res.status(201).json({
                cases: data

                ,
            });
        }

    });


});

app.get('/comments', authenticateToken, (req, res) => {
    const { case_id } = req.body;

    db.all('SELECT * FROM comments WHERE case_id = ?', [case_id], (err, data) => {

        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate user' });
        }

        if (!data) {
            return res.status(401).json({ error: 'No comments' });
        }
        if (data) {
            res.status(201).json({
                comments: data

                ,
            });
        }

    });


});

app.post('/case', authenticateToken, (req, res) => {

    const { title, description, user_id } = req.body;
    db.run('INSERT INTO cases (title, description, user_id) VALUES (?,?,?)', [title, description, user_id], (err) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(201).json({ message: 'User registered successfully' });
    });

});

app.post('/comment', authenticateToken, (req, res) => {

    const { description, user_id, case_id, likes } = req.body;
    db.run('INSERT INTO comments (description, user_id, case_id, likes) VALUES (?,?,?,?)', [description, user_id, case_id, likes], (err) => {
        if (err) {
            return res.status(500).json({ error: "Problem adding the comment"});
        }
        res.status(201).json({ message: 'Comment added successfully ' });
    });

});

app.put('/like', authenticateToken, (req, res) => {
    const {comment_id} = req.body;
    db.run('UPDATE comments SET likes = likes + 1 WHERE comment_id = ?', [comment_id], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Problem liking the comment' });
        }
        res.status(201).json({ message: 'Liked' });
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