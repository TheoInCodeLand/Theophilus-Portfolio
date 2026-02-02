const express = require("express");
const path = require("path");
const session = require('express-session');
const pool = require('./database/db');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const projectRoutes = require('./routes/projects');
const profileRoutes = require('./routes/profile');
const experienceRoutes = require('./routes/experience');
const skillRoutes = require('./routes/skills');

const app = express();

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// --- PUBLIC ROUTES ---

// The Main Portfolio Page (Dynamic Fetch)
app.get('/', async (req, res) => {
    try {
        const profileRes = await pool.query('SELECT * FROM profile WHERE id = 1');
        const projectsRes = await pool.query('SELECT * FROM projects ORDER BY date_completed DESC');
        const skillsRes = await pool.query('SELECT * FROM skills');
        // If you have experience section
        const expRes = await pool.query('SELECT * FROM experience ORDER BY start_date DESC');

        res.render('Home', {
            profile: profileRes.rows[0],
            projects: projectsRes.rows,
            skills: skillsRes.rows,
            experience: expRes.rows
        });
    } catch (err) {
        console.error(err);
        res.send("Database Error");
    }
});

// --- ADMIN ROUTES ---
app.use('/auth', authRoutes);
app.use('/admin/projects', projectRoutes);
app.use('/admin/profile', profileRoutes);
app.use('/admin/experience', experienceRoutes);
app.use('/admin/skills', skillRoutes);
app.use('/admin/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});