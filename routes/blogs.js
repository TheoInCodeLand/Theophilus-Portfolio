const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

const isAdmin = (req, res, next) => {
    if (req.session.userId) return next();
    res.redirect('/auth/login');
};

// GET: Admin List View
router.get('/', isAdmin, async (req, res) => {
    const result = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
    res.render('admin/blogs-list', { blogs: result.rows });
});

// GET: Add Form
router.get('/add', isAdmin, (req, res) => {
    res.render('admin/blog-form');
});

// POST: Add Blog
router.post('/add', isAdmin, upload.single('blogImage'), async (req, res) => {
    const { title, external_link, category, read_time } = req.body;
    const image_url = req.file ? req.file.path : null;

    try {
        await pool.query(
            'INSERT INTO blogs (title, external_link, category, read_time, image_url) VALUES ($1, $2, $3, $4, $5)',
            [title, external_link, category, read_time, image_url]
        );
        res.redirect('/admin/blogs');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding blog');
    }
});

// POST: Delete Blog
router.post('/delete/:id', isAdmin, async (req, res) => {
    await pool.query('DELETE FROM blogs WHERE id = $1', [req.params.id]);
    res.redirect('/admin/blogs');
});

module.exports = router;