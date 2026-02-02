const pool = require('./database/db'); // Your database connection
const bcrypt = require('bcrypt');

const seedAdmin = async () => {
    // Your credentials
    const email = 'theophiles.thobejane@gmail.com'; // This will be stored in the 'username' column
    const password = 'tH3o#2026';
    const saltRounds = 10;

    try {
        console.log('Hashing password...');
        const hash = await bcrypt.hash(password, saltRounds);

        const check = await pool.query('SELECT * FROM admins WHERE username = $1', [email]);

        if (check.rows.length > 0) {
            console.log('Admin user already exists. Updating password...');
            await pool.query('UPDATE admins SET password_hash = $1 WHERE username = $2', [hash, email]);
        } else {
            console.log('Creating new admin user...');
            await pool.query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', [email, hash]);
        }

        console.log(`\n✅ Success! You can now log in with:\nEmail: ${email}\nPassword: ${password}`);

    } catch (err) {
        console.error('❌ Error seeding admin:', err);
    } finally {
        pool.end();
    }
};
seedAdmin();