import pool from "../../database.js";

const addingMeal = async (req, res) => {
  const client = await pool.connect(); // Acquire a database connection
  try {
    await client.query("BEGIN"); // Start a transaction

    // Validate image upload
    if (!req.file || !req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ error: "Valid image file required" });
    }

    // Parse and validate request body fields
    const { mealName, mealDescription, recipe, ingredientsList, ratios, mainIngredients } = req.body;

    if (!mealName || !mealDescription || !recipe || !ingredientsList || !ratios || !mainIngredients) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Parse JSON strings into objects
    let ingredients;
    let ratioObj;
    let mainIngredientsObj;

    try {
      ingredients = JSON.parse(ingredientsList);
      ratioObj = JSON.parse(ratios);
      mainIngredientsObj = JSON.parse(mainIngredients);
    } catch (parseError) {
      return res.status(400).json({ error: "Invalid JSON data in request body" });
    }

    if (!Array.isArray(ingredients)) {
      return res.status(400).json({ error: "Ingredients list must be an array" });
    }

    // Insert the new meal into the "Meal" table
    const mealResult = await client.query(
      'INSERT INTO "Meal" (name, description, image_data) VALUES ($1, $2, $3) RETURNING id',
      [mealName, mealDescription, req.file.buffer] // Use `req.file.buffer` for the uploaded image
    );
    const mealId = mealResult.rows[0].id;

    // Process and link ingredients to the meal
    for (const ingredientName of ingredients) {
      // Check if the ingredient already exists in the "Ingredient" table
      const existingIngredient = await client.query(
        'SELECT id FROM "Ingredient" WHERE name = $1',
        [ingredientName]
      );

      let ingredientId;
      if (existingIngredient.rows.length > 0) {
        // Use existing ingredient ID
        ingredientId = existingIngredient.rows[0].id;
      } else {
        // Insert new ingredient into the "Ingredient" table
        const newIngredient = await client.query(
          'INSERT INTO "Ingredient" (name, unit) VALUES ($1, $2) RETURNING id',
          [ingredientName, "unit"] // Default unit (you can modify this as needed)
        );
        ingredientId = newIngredient.rows[0].id;
      }

      // Link the ingredient to the meal in the "MealIngredient" table
      await client.query(
        `INSERT INTO "MealIngredient" 
         ("mealId", "ingredientId", "isMainIngredient", "dependencyRatio") 
         VALUES ($1, $2, $3, $4)`,
        [
          mealId,
          ingredientId,
          !!mainIngredientsObj[ingredientName], // Convert to boolean
          parseFloat(ratioObj[ingredientName]) || 0, // Default to 0 if ratio is invalid
        ]
      );
    }

    // Insert the recipe into the "Recipe" table
    await client.query('INSERT INTO "Recipe" (steps, "mealId") VALUES ($1, $2)', [recipe, mealId]);

    // Commit the transaction
    await client.query("COMMIT");
    res.status(201).json({ message: "Meal added successfully!" });
  } catch (err) {
    // Rollback the transaction in case of an error
    await client.query("ROLLBACK");
    console.error("Database Error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    // Release the database connection back to the pool
    client.release();
  }
};

export default addingMeal;