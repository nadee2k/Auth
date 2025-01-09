const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt'); // For password hashing
const connection = require('./datababe');

app.use(cors());
app.use(express.json());//adding

database.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
    } else {
        console.log('Connected to MySQL database');
    }
});

// User registration endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ message: 'User registered!' });
    });
});


// User login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    pool.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send({ message: 'User not found' });

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).send({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send({ token });
    });
});

// Middleware to authenticate JWT tokens
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
    res.send({ message: 'This is protected data', userId: req.user.id });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});

// Route to validate password
app.post('/validatePassword', (request, response) => {
    console.log('Request received:', request.body);
    const { username, password } = request.body;

    const query = `SELECT * FROM user WHERE username = ?`;
    database.query(query, [username], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            response.status(500).send('Server error');
            return;
        }
        if (rows.length > 0) {
            // Compare password with hashed password in database
            const hashedPassword = rows[0].password;
            bcrypt.compare(password, hashedPassword, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing passwords:', err.message);
                    response.status(500).send('Server error');
                    return;
                }
                if (isMatch) {
                    console.log('User validated:', rows[0]);
                    response.status(200).send({ validation: true });
                } else {
                    console.log('Invalid password for:', username);
                    response.status(401).send({ validation: false });
                }
            });
        } else {
            console.log('User not found:', username);
            response.status(404).send({ validation: false });
        }
    });
});

// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));
