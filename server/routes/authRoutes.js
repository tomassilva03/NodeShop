
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../database');

// Register user
router.post('/register', async (req, res) => {
    try {
        const { email, password, first_name, last_name, phone_number } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Validate input (Add more validation as needed)
        if (!email || !password || !first_name || !last_name) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Insert user into the database
        const result = await pool.query(
            'INSERT INTO app_user (email, password, first_name, last_name, phone_number) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [email, hashedPassword, first_name, last_name, phone_number]
        );

        const newUser = result.rows[0];

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    // Implementation
});

// Logout (optional)
router.post('/logout', (req, res) => {
    // Implementation
});

module.exports = router;
