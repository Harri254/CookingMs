import pool from "../../database.js";

const gettingMealById = async (req, res) => {
  try {
    const mealId = req.params.id;

    // Fetch meal details including ingredients and recipe
    const query = `
      SELECT 
        m.id AS meal_id,
        m.name AS meal_name,
        m.description AS meal_description,
        encode(m.image_data, 'base64') AS image_base64,
        json_agg(
          json_build_object(
            'ingredientId', i.id,
            'ingredientName', i.name,
            'unit', i.unit,
            'isMainIngredient', mi."isMainIngredient",
            'dependencyRatio', mi."dependencyRatio"
          )
        ) AS ingredients,
        r.steps AS recipe_steps
      FROM "Meal" m
      LEFT JOIN "MealIngredient" mi ON m.id = mi."mealId"
      LEFT JOIN "Ingredient" i ON mi."ingredientId" = i.id
      LEFT JOIN "Recipe" r ON m.id = r."mealId"
      WHERE m.id = $1
      GROUP BY m.id, m.name, m.description, m.image_data, r.steps
    `;

    const result = await pool.query(query, [mealId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Meal not found" });
    }

    const meal = result.rows[0];
    res.status(200).json({
      id: meal.meal_id,
      name: meal.meal_name,
      description: meal.meal_description,
      image: `data:image/jpeg;base64,${meal.image_base64}`,
      ingredients: meal.ingredients,
      recipe: meal.recipe_steps,
    });
  } catch (err) {
    console.error("Error fetching meal by ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default gettingMealById;