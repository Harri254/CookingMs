import pg from 'pg';
const { Pool } = pg;

// Database connection configuration
const pool = new Pool({
    user: 'postgres', // Your PostgreSQL username
    host: 'localhost', // Your PostgreSQL host
    database: 'cookingms', // Your database name
    password: 'katu@004', // Your PostgreSQL password
    port: 5432, // Default PostgreSQL port
});

export default pool;