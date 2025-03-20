
import mysql from 'mysql2/promise';

// Database connection configuration
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'education_portal',
};

// Create a connection pool for better performance
const pool = mysql.createPool(dbConfig);

export default pool;
