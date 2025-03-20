import pool from "../../database.js";

const updatingMeal = async (req, res) => {
  try {
    const mealId = req.params.id;
    const {
      mealName,
      mealDescription,
      ingredientsList, // Array of ingredients
      ratios, // Ratios for each ingredient
      mainIngredients, // Main ingredient status
      recipe, // Recipe steps
    } = req.body;
    const image = req.file ? req.file.buffer : null;

    // Start a transaction to ensure atomicity
    await pool.query("BEGIN");

    try {
      // Update the Meal table
      const query = `
        UPDATE "Meal"
        SET name = $1, description = $2 ${image ? ", image_data = $3" : ""}
        WHERE id = ${mealId}
        RETURNING id
      `;

      const values = image ? [mealName, mealDescription, image] : [mealName, mealDescription];
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        await pool.query("ROLLBACK");
        return res.status(404).json({ error: "Meal not found" });
      }

      // Update the Recipe table
      const recipeQuery = `
        INSERT INTO "Recipe" ("mealId", steps)
        VALUES ($1, $2)
        ON CONFLICT ("mealId") DO UPDATE
        SET steps = EXCLUDED.steps
      `;
      await pool.query(recipeQuery, [mealId, recipe]);

      // Delete existing ingredients for the meal
      await pool.query(
        `
          DELETE FROM "MealIngredient"
          WHERE "mealId" = $1
        `,
        [mealId]
      );

      // Insert new ingredients
      const ingredientInsertQuery = `
        INSERT INTO "MealIngredient" ("mealId", "ingredientId", "isMainIngredient", "dependencyRatio")
        VALUES ($1, $2, $3, $4)
      `;

      for (const ingredient of ingredientsList) {
        const ingredientId = await getOrCreateIngredientId(ingredient); // Helper function to get or create ingredient ID
        await pool.query(ingredientInsertQuery, [
          mealId,
          ingredientId,
          mainIngredients[ingredient] || false,
          ratios[ingredient] || 0,
        ]);
      }

      // Commit the transaction
      await pool.query("COMMIT");

      res.status(200).json({ message: "Meal updated successfully" });
    } catch (err) {
      // Rollback the transaction in case of an error
      await pool.query("ROLLBACK");
      throw err;
    }
  } catch (err) {
    console.error("Error updating meal:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Helper function to get or create an ingredient ID
const getOrCreateIngredientId = async (ingredientName) => {
  const result = await pool.query(
    `
      SELECT id FROM "Ingredient"
      WHERE name = $1
    `,
    [ingredientName]
  );

  if (result.rows.length > 0) {
    return result.rows[0].id;
  }

  const insertResult = await pool.query(
    `
      INSERT INTO "Ingredient" (name)
      VALUES ($1)
      RETURNING id
    `,
    [ingredientName]
  );

  return insertResult.rows[0].id;
};

export default updatingMeal;