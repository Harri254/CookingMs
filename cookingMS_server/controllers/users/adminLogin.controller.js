import pool from "../../database.js";


const adminLoging = async (req, res) => {
  const { id, password } = req.body; // Ensure this matches the frontend's field names
    console.log(id,password);

  if (!id || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Query the database using the correct parameter
    const result = await pool.query('SELECT * FROM "User" WHERE id = $1', [id]);
    const user = result.rows[0]; // Use rows[0] (PostgreSQL returns rows array)

    if (!user) {
      return res.status(401).json({ error: 'Invalid ID or password' });
    }

    // Compare passwords (replace with bcrypt.compare in production)
    if (password === user.password) {
      res.json(user);
    } else {
      res.status(401).json({ error: 'Invalid ID or password' });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default adminLoging;