import pool from "../../database.js";

const addingMeal = async (req, res) => {
    const { mealName, mealDescription, newIngredientString, file, recipe, mainIngredients, ratios } = req.body;

    // Validate required fields
    if (!mealName || !mealDescription || !newIngredientString || !recipe) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Start a transaction
        await pool.query('BEGIN');

        // Step 1: Insert into "Meal" table
        const mealResult = await pool.query(
            'INSERT INTO "Meal" (name, description, picture_url) VALUES ($1, $2, $3) RETURNING id',
            [mealName, mealDescription, file]
        );
        const mealId = mealResult.rows[0].id;

        // Step 2: Parse and insert ingredients into "Ingredient" table
        const ingredients = newIngredientString
            .split(/[, ]+/) // Split by comma or space
            .map((ingredient) => ingredient.trim()) // Trim whitespace
            .filter((ingredient) => ingredient !== ""); // Remove empty strings

        const ingredientIds = {};
        for (const ingredientName of ingredients) {
            // Check if the ingredient already exists
            const existingIngredient = await pool.query(
                'SELECT id FROM "Ingredient" WHERE name = $1',
                [ingredientName]
            );

            if (existingIngredient.rows.length > 0) {
                // Ingredient exists, use its ID
                ingredientIds[ingredientName] = existingIngredient.rows[0].id;
            } else {
                // Insert new ingredient
                const newIngredient = await pool.query(
                    'INSERT INTO "Ingredient" (name, unit) VALUES ($1, $2) RETURNING id',
                    [ingredientName, "unit"] // Default unit (you can modify this)
                );
                ingredientIds[ingredientName] = newIngredient.rows[0].id;
            }
        }

        // Step 3: Link ingredients to the meal in "MealIngredient" table
        for (const [ingredientName, ingredientId] of Object.entries(ingredientIds)) {
            const isMain = !!mainIngredients[ingredientName]; // Check if it's a main ingredient
            const ratio = parseFloat(ratios[ingredientName]) || 0; // Default ratio to 0 if not provided

            await pool.query(
                'INSERT INTO "MealIngredient" (mealId, ingredientId, isMainIngredient, quantityPerStudent, dependencyRatio) VALUES ($1, $2, $3, $4, $5)',
                [mealId, ingredientId, isMain, 1, ratio] // Default quantityPerStudent to 1
            );
        }

        // Step 4: Insert recipe into "Recipe" table
        await pool.query(
            'INSERT INTO "Recipe" (steps, mealId) VALUES ($1, $2)',
            [recipe, mealId]
        );

        // Commit the transaction
        await pool.query('COMMIT');

        // Return success response
        return res.status(201).json({ message: 'Meal added successfully!' });
    } catch (err) {
        // Rollback the transaction in case of an error
        await pool.query('ROLLBACK');
        console.error(err.message);
        return res.status(500).json({ error: 'Failed to add meal' });
    }
};

export default addingMeal;