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

// GET: List all projects
router.get('/', isAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM projects ORDER BY date_completed DESC');
        res.render('admin/projects-list', { projects: result.rows });
    } catch (err) {
        console.error("Error fetching projects:", err); // Improved logging
        res.status(500).send('Server Error');
    }
});

// GET: Add Form
router.get('/add', isAdmin, (req, res) => {
    res.render('admin/project-form', { project: null });
});

// GET: Edit Form
router.get('/edit/:id', isAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.redirect('/admin/projects');
        res.render('admin/project-form', { project: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// POST: Add Project (With Debugging)
router.post('/add', isAdmin, upload.single('projectMedia'), async (req, res) => {
    // DEBUG: Log the file to see if Cloudinary worked
    console.log("Uploaded File Info:", req.file); 

    const { title, category, tech_stacks, description, duration, date_completed, github, demo } = req.body;
    
    // Cloudinary usually returns the URL in req.file.path or req.file.secure_url
    const videoUrl = req.file ? req.file.path : null; 
    
    // Handle cases where tech_stacks might be empty or undefined
    const techArray = tech_stacks ? tech_stacks.split(',').map(s => s.trim()) : [];

    try {
        await pool.query(
            `INSERT INTO projects 
            (title, category, tech_stacks, description, duration_months, date_completed, video_url, github_link, demo_link) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [title, category, techArray, description, duration, date_completed, videoUrl, github, demo]
        );
        res.redirect('/admin/projects');
    } catch (err) {
        console.error("Database Insert Error:", err);
        res.status(500).send("Error adding project");
    }
});

// POST: Update Project (With Debugging)
router.post('/update/:id', isAdmin, upload.single('projectMedia'), async (req, res) => {
    const { title, category, tech_stacks, description, duration, date_completed, github, demo } = req.body;
    const techArray = tech_stacks ? tech_stacks.split(',').map(s => s.trim()) : [];
    
    try {
        let videoUrl;
        if (req.file) {
            console.log("New File Uploaded:", req.file); // DEBUG
            videoUrl = req.file.path;
        } else {
            const oldProject = await pool.query('SELECT video_url FROM projects WHERE id = $1', [req.params.id]);
            videoUrl = oldProject.rows[0]?.video_url; 
        }

        await pool.query(
            `UPDATE projects SET 
            title=$1, category=$2, tech_stacks=$3, description=$4, duration_months=$5, date_completed=$6, video_url=$7, github_link=$8, demo_link=$9
            WHERE id=$10`,
            [title, category, techArray, description, duration, date_completed, videoUrl, github, demo, req.params.id]
        );
        res.redirect('/admin/projects');
    } catch (err) {
        console.error("Database Update Error:", err);
        res.status(500).send("Error updating project");
    }
});

router.post('/delete/:id', isAdmin, async (req, res) => {
    await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id]);
    res.redirect('/admin/projects');
});

module.exports = router;