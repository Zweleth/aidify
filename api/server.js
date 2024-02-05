const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 80;
const SECRET_KEY = 'your_secret_key'; // Change this with a secure secret key

// Create SQLite database and table
const db = new sqlite3.Database('./aidify.db');
// db.run('CREATE TABLE users (user_id char(36) NOT NULL DEFAULT (uuid()) UNIQUE PRIMARY KEY, username TEXT NOT NULL, password TEXT NOT NULL)');

// Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, ALL', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
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

        // Hash the password
        // Insert user into the database
        db.run('INSERT INTO users (username, password) VALUES (?,?)', [username, hashedPassword], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to register user' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    })





});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    let user_id

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate user' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid username' });
        }
        if (user) {
            user_id = (user.user_id)
        }

        // Compare the provided password with the hashed password from the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '3h' });


        if (passwordMatch) {
            res.status(201).json({
                token, user_id
            });
        }
    });
});

// Fetch all support cases
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
            });
        }

    });


});
// fetch support cases of a logged user
app.get('/cases/:id', authenticateToken, (req, res) => {

    db.all('SELECT t1.*, COUNT(t2.case_id) AS num_of_replies FROM cases t1 LEFT JOIN comments t2 ON t1.case_id = t2.case_id WHERE t1.user_id = ? GROUP BY t1.case_id', [req.params.id], (err, data) => {

        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate user' });
        }

        if (!data) {
            return res.status(401).json({ error: 'There are no support cases' });
        }
        if (data) {
            res.status(201).json({
                cases: data
            });
        }

    });


});

//Fetch comments for a support case

app.get('/comments/:id', authenticateToken, (req, res) => {
    db.all('SELECT * FROM cases WHERE case_id = ?', [req.params.id], (err, data1) => {

        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate user' });
        }

        if (!data1) {
            return res.status(401).json({ error: 'No comments' });
        }
        if (data1) {
            db.all('SELECT t1.*, COUNT(t2.comment_id) AS likes FROM comments t1 LEFT JOIN likes t2 ON t1.comment_id = t2.comment_id WHERE t1.case_id = ? GROUP BY t1.comment_id', [req.params.id], (err, data2) => {

                if (err) {
                    return res.status(500).json({ error: 'Failed to authenticate user' });
                }

                if (!data2) {
                    return res.status(401).json({ error: 'No comments' });
                }
                if (data2) {
                    res.status(201).json({
                        case: data1,
                        comments: data2

                        ,
                    });
                }

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
            return res.status(500).json({ error: "Problem adding the comment" });
        }
        res.status(201).json({ message: 'Comment added successfully ' });
    });

});

app.post('/like', authenticateToken, (req, res) => {
    const { comment_id, user_id } = req.body;
    db.get('SELECT * FROM likes WHERE user_id = ? AND comment_id = ?', [user_id, comment_id], async (err, like) => {
        if (like) {
            return res.status(500).json({ error: 'Problem liking the comment' });
        }
        if (!like) {
            db.run('INSERT INTO likes (comment_id, user_id) VALUES (?,?)', [comment_id, user_id], (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Problem liking the comment' });
                }
                res.status(201).json({ message: 'Liked' });
            });
        }

    })

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