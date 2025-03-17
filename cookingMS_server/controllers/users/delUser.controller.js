import pool from "../../database.js";

const delUsers = async (req, res) => {
    const { userId } = req.params;
    console.log(userId);

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const result = await pool.query('DELETE FROM "User" WHERE id = $1', [userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default delUsers;