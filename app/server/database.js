const mysql = require('mysql2');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: '123456789', // Your MySQL password
    database: 'auth',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL database');
});

export default connection;
