const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/portfolio.db', (err) => {
    if (err) console.log('Failed to connect to the database, error: ', err.message );
    console.log('Connected to the SQLite database.');
});

module.exports = db;