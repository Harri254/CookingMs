import pool from "../../database.js";

const deletingMeal = async (req, res) => {
  try {
    const mealId = req.params.id;

    // Ensure mealId is valid
    if (!mealId || isNaN(mealId)) {
      return res.status(400).json({ error: "Invalid meal ID" });
    }

    // Delete the meal from the database
    const query = `
      DELETE FROM "Meal"
      WHERE id = $1
      RETURNING id
    `;

    const result = await pool.query(query, [mealId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Meal not found" });
    }

    res.status(200).json({ message: "Meal deleted successfully" });
  } catch (err) {
    console.error("Error deleting meal:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default deletingMeal;