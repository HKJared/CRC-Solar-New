const mysql = require('mysql2/promise');
require('dotenv').config();
// Lấy thông tin kết nối từ biến môi trường
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    database: process.env.DB_DATABASE || 'crc_solar',
    password: process.env.DB_PASSWORD || '',  
    port: process.env.DB_PORT || 3306        
});

module.exports = pool;