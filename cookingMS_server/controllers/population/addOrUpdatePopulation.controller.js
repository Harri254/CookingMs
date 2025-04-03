import pool from "../../database.js";

const addPopulation = async (req, res) => {

    const { studentCount, teacherCount } = req.body;
    try {
      await pool.query(
        `
          INSERT INTO "PopulationSettings" (studentCount, teacherCount)
          VALUES ($1, $2)
          ON CONFLICT (id) DO UPDATE
          SET studentCount = EXCLUDED.studentCount, teacherCount = EXCLUDED.teacherCount
        `,
        [studentCount, teacherCount]
      );
      res.json({ message: "Population settings updated successfully" });
    } catch (err) {
      console.error("Error updating population settings:", err);
      res.status(500).json({ error: "Internal server error" });
    }
}

export default addPopulation;