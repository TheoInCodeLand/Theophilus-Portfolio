const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// Middleware: Strict check to ensure only logged-in users access this
const isAdmin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/auth/login');
    }
    next();
};

// GET: Main Dashboard
router.get('/', isAdmin, async (req, res) => {
    try {
        // Fetch quick stats for the dashboard cards
        const projectCount = await pool.query('SELECT COUNT(*) FROM projects');
        const skillCount = await pool.query('SELECT COUNT(*) FROM skills');
        const experienceCount = await pool.query('SELECT COUNT(*) FROM experience');
        
        // Fetch your first name for a personalized welcome
        const profile = await pool.query('SELECT first_name FROM profile WHERE id = 1');

        res.render('admin/dashboard', {
            username: req.session.username,
            firstName: profile.rows[0]?.first_name || 'Admin',
            stats: {
                projects: projectCount.rows[0].count,
                skills: skillCount.rows[0].count,
                experience: experienceCount.rows[0].count
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});

module.exports = router;