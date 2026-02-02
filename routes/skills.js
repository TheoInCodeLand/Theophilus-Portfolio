const express = require('express');
const router = express.Router();
const pool = require('../database/db');

const isAdmin = (req, res, next) => {
    if (req.session.userId) return next();
    res.redirect('/auth/login');
};

router.get('/', isAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM skills ORDER BY category, name');
        res.render('admin/skills-manager', { skills: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/add', isAdmin, async (req, res) => {
    const { name, icon_class, category } = req.body;

    try {
        await pool.query(
            'INSERT INTO skills (name, icon_class, category) VALUES ($1, $2, $3)',
            [name, icon_class, category]
        );
        res.redirect('/admin/skills');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding skill");
    }
});

router.post('/delete/:id', isAdmin, async (req, res) => {
    await pool.query('DELETE FROM skills WHERE id = $1', [req.params.id]);
    res.redirect('/admin/skills');
});

module.exports = router;