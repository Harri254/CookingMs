import pool from "../../database.js";

const deletingMeal = async (req, res) => {
  try {
    const mealId = req.params.id;

    // Ensure mealId is valid
    if (!mealId || isNaN(mealId)) {
      return res.status(400).json({ error: "Invalid meal ID" });
    }

    // Start a transaction to ensure atomicity
    await pool.query("BEGIN");

    try {
      // Delete related records in the MealIngredient table
      await pool.query(
        `
          DELETE FROM "MealIngredient"
          WHERE "mealId" = $1
        `,
        [mealId]
      );

      // Delete related records in the Recipe table (if applicable)
      await pool.query(
        `
          DELETE FROM "Recipe"
          WHERE "mealId" = $1
        `,
        [mealId]
      );

      // Finally, delete the meal itself
      const query = `
        DELETE FROM "Meal"
        WHERE id = $1
        RETURNING id
      `;

      const result = await pool.query(query, [mealId]);

      if (result.rows.length === 0) {
        await pool.query("ROLLBACK");
        return res.status(404).json({ error: "Meal not found" });
      }

      // Commit the transaction
      await pool.query("COMMIT");

      res.status(200).json({ message: "Meal deleted successfully" });
    } catch (err) {
      // Rollback the transaction in case of an error
      await pool.query("ROLLBACK");
      throw err;
    }
  } catch (err) {
    console.error("Error deleting meal:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default deletingMeal;