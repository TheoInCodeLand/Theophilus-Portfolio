const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// Middleware: Protect Admin Routes
const isAdmin = (req, res, next) => {
    if (req.session.userId) return next();
    res.redirect('/auth/login');
};

// GET: List all experience (Admin View)
router.get('/', isAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM experience ORDER BY start_date DESC');
        res.render('admin/experience-list', { experience: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// GET: Render "Add Experience" Form
router.get('/add', isAdmin, (req, res) => {
    res.render('admin/experience-form', { job: null }); // null means we are adding new
});

// POST: Add New Experience
router.post('/add', isAdmin, async (req, res) => {
    const { company, position, location, start_date, end_date, description, bullets_input } = req.body;
    
    // Logic: If 'end_date' is empty, assume it's a current job
    const is_current = !end_date; 
    
    // Logic: Convert textarea (one bullet per line) into an Array
    // We split by newline (\n) and remove empty lines
    const bullet_points = bullets_input 
        ? bullets_input.split('\n').map(line => line.trim()).filter(line => line.length > 0)
        : [];

    try {
        await pool.query(
            `INSERT INTO experience 
            (company_name, position, location, start_date, end_date, is_current, description, bullet_points) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [company, position, location, start_date, end_date || null, is_current, description, bullet_points]
        );
        res.redirect('/admin/experience');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding experience");
    }
});

// POST: Delete Experience
router.post('/delete/:id', isAdmin, async (req, res) => {
    await pool.query('DELETE FROM experience WHERE id = $1', [req.params.id]);
    res.redirect('/admin/experience');
});

// OPTIONAL: GET Edit Page (If you want to edit existing jobs)
router.get('/edit/:id', isAdmin, async (req, res) => {
    const result = await pool.query('SELECT * FROM experience WHERE id = $1', [req.params.id]);
    res.render('admin/experience-form', { job: result.rows[0] });
});

// OPTIONAL: POST Update Logic
router.post('/update/:id', isAdmin, async (req, res) => {
    const { company, position, location, start_date, end_date, description, bullets_input } = req.body;
    const is_current = !end_date;
    const bullet_points = bullets_input.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    await pool.query(
        `UPDATE experience SET 
        company_name=$1, position=$2, location=$3, start_date=$4, end_date=$5, is_current=$6, description=$7, bullet_points=$8
        WHERE id=$9`,
        [company, position, location, start_date, end_date || null, is_current, description, bullet_points, req.params.id]
    );
    res.redirect('/admin/experience');
});

module.exports = router;