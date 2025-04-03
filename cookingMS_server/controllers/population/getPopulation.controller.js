import pool from "../../database.js";

const getPopulation = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM \"PopulationSettings\" LIMIT 1");
        if (result.rows.length > 0) {
          res.json(result.rows[0]);
        } else {
          res.status(404).json({ error: "Population settings not found" });
        }
      } catch (err) {
        console.error("Error fetching population settings:", err);
        res.status(500).json({ error: "Internal server error" });
      }
}

export default getPopulation;