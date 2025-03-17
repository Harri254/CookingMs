import pool from "../../database.js";

const manageUsers = async (req, res) => {
    try {
        // Execute the SELECT query
        const result = await pool.query('SELECT id, email FROM "User" WHERE role = $1', ['chef']);

        // Send the list of users as the response
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default manageUsers;