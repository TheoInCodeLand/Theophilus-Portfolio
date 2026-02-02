const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const bcrypt = require('bcrypt');

// GET: Render Login Page
router.get('/login', (req, res) => {
    // If user is already logged in, redirect to dashboard immediately
    if (req.session.userId) {
        return res.redirect('/admin/dashboard');
    }
    res.render('admin/login', { error: null });
});

// POST: Handle Login Submission
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Find admin user by username
        const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
        
        if (result.rows.length > 0) {
            const admin = result.rows[0];
            
            // 2. Compare the entered password with the stored hash
            const match = await bcrypt.compare(password, admin.password_hash);
            
            if (match) {
                // 3. Success: Create session variables
                req.session.userId = admin.id;
                req.session.username = admin.username;
                return res.redirect('/admin/dashboard');
            }
        }
        
        // 4. Failure: Re-render login with error message
        res.render('admin/login', { error: 'Invalid Credentials' });
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// GET: Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error(err);
        res.redirect('/auth/login');
    });
});

module.exports = router;