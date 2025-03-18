import pool from "../../database.js";

const addingMeal = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Validate image
    if (!req.files?.image || !req.files.image.mimetype.startsWith("image/")) {
      return res.status(400).json({ error: "Valid image required" });
    }

    // Parse and validate data
    const { mealName, mealDescription, recipe, ingredientsList, ratios, mainIngredients } = req.body;
    if (!mealName || !mealDescription || !recipe || !ingredientsList || !ratios || !mainIngredients) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert meal
    const mealResult = await client.query(
      'INSERT INTO "Meal" (name, description, image_data) VALUES ($1, $2, $3) RETURNING id',
      [mealName, mealDescription, req.files.image.data]
    );
    const mealId = mealResult.rows[0].id;

    // Process ingredients
    const ingredients = JSON.parse(ingredientsList);
    const ratioObj = JSON.parse(ratios);
    const mainIngredientsObj = JSON.parse(mainIngredients);

    for (const ingredientName of ingredients) {
      // Check existing ingredient
      const existing = await client.query('SELECT id FROM "Ingredient" WHERE name = $1', [ingredientName]);
      let ingredientId;
      if (existing.rows.length > 0) {
        ingredientId = existing.rows[0].id;
      } else {
        const newIngredient = await client.query(
          'INSERT INTO "Ingredient" (name, unit) VALUES ($1, $2) RETURNING id',
          [ingredientName, "unit"] // Default unit (modify as needed)
        );
        ingredientId = newIngredient.rows[0].id;
      }

      // Link to meal
      await client.query(
        `INSERT INTO "MealIngredient" 
         ("mealId", "ingredientId", "isMainIngredient", "dependencyRatio") 
         VALUES ($1, $2, $3, $4)`,
        [
          mealId,
          ingredientId,
          !!mainIngredientsObj[ingredientName],
          parseFloat(ratioObj[ingredientName]) || 0,
        ]
      );
    }

    // Insert recipe
    await client.query('INSERT INTO "Recipe" (steps, "mealId") VALUES ($1, $2)', [recipe, mealId]);

    await client.query("COMMIT");
    res.status(201).json({ message: "Meal added successfully!" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Database Error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

export default addingMeal;