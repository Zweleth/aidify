const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = 'your_secret_key'; // Change this with a secure secret key
// Create SQLite database and table
const db = new sqlite3.Database('./aidify.db');
db.run('SELECT * FROM users');



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });