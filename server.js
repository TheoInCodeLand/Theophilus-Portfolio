const express = require("express");
const path = require("path");
const session = require('express-session');
const pool = require('./database/db');
require('dotenv').config();

const app = express();

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// --- PUBLIC ROUTES --- 
app.get('/', async (req, res) => {
    try {
        const profileRes = await pool.query('SELECT * FROM profile WHERE id = 1');
        const projectsRes = await pool.query('SELECT * FROM projects ORDER BY date_completed DESC');
        const skillsRes = await pool.query('SELECT * FROM skills');
        const blogsRes = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC LIMIT 6');
        const expRes = await pool.query('SELECT * FROM experience ORDER BY start_date DESC');

        res.render('Home', {
            profile: profileRes.rows[0],
            projects: projectsRes.rows,
            skills: skillsRes.rows,
            experience: expRes.rows,
            blogs: blogsRes.rows
        });
    } catch (err) {
        console.error(err);
        res.send("Error loading portfolio data.");
    }
});

// --- ADMIN ROUTES ---
app.use('/auth', require('./routes/auth'));
app.use('/admin/projects', require('./routes/projects'));
app.use('/admin/profile', require('./routes/profile'));
app.use('/admin/experience', require('./routes/experience'));
app.use('/admin/skills', require('./routes/skills'));
app.use('/admin/dashboard', require('./routes/dashboard'));
app.use('/admin/blogs', require('./routes/blogs'));
app.use('/api/chat', require('./routes/chat'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});