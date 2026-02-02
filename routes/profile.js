const express = require('express');
const router = express.Router();
const pool = require('../database/db');

const isAdmin = (req, res, next) => {
    if (req.session.userId) return next();
    res.redirect('/auth/login');
};

// GET: Render Edit Profile Page
router.get('/', isAdmin, async (req, res) => {
    // Fetch the single profile row (ID 1)
    const result = await pool.query('SELECT * FROM profile WHERE id = 1');
    const profile = result.rows[0] || {};
    res.render('admin/profile', { profile });
});

// POST: Update Profile
router.post('/update', isAdmin, async (req, res) => {
    const { first_name, last_name, summary, address, email, phone, linkedin, github } = req.body;
    
    // Upsert logic (Update if exists, Insert if not)
    const query = `
        INSERT INTO profile (id, first_name, last_name, professional_summary, address, email, phone, linkedin_url, github_url)
        VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        professional_summary = EXCLUDED.professional_summary,
        address = EXCLUDED.address,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        linkedin_url = EXCLUDED.linkedin_url,
        github_url = EXCLUDED.github_url;
    `;
    
    await pool.query(query, [first_name, last_name, summary, address, email, phone, linkedin, github]);
    res.redirect('/admin/profile');
});

module.exports = router;