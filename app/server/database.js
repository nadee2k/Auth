import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: 'example', // Your MySQL password
    database: 'auth',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Connect to MySQL
pool.getConnection((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL database');
});

export default pool;
