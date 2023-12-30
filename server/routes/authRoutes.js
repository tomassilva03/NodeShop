
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../database');
const { v4: uuidv4 } = require('uuid');


// Register user
router.post('/api/register', async (req, res) => {
    try {
        // Generate a random UUID for the user
        const userId = uuidv4();

        const { email, password, first_name, last_name, phone_number } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Validate input (Add more validation as needed)
        if (!email || !password || !first_name || !last_name) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Insert user into the database
        const result = await pool.query(
            'INSERT INTO nodeshop.app_user (id, email, password, first_name, last_name, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [userId, email, hashedPassword, first_name, last_name, phone_number]
        );

        const newUser = result.rows[0];

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login user
router.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input (Add more validation as needed)
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if user exists
        const result = await pool.query('SELECT * FROM nodeshop.app_user WHERE email = $1', [email]);

        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Logout (optional)
router.post('/api/logout', (req, res) => {
    // Implementation
});

module.exports = router;
