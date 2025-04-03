import pool from "../../database.js";

const gettingAllMeals = async (req, res) => {
  try {
    // Fetch meals with their ingredients and recipes
    const mealsQuery = `
      SELECT 
        m.id AS meal_id,
        m.name AS meal_name,
        m.description AS meal_description,
        encode(m.image_data, 'base64') AS image_base64, -- Convert binary image data to base64
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
      GROUP BY m.id, m.name, m.description, m.image_data, r.steps
    `;

    const result = await pool.query(mealsQuery);

    // Format the response
    const meals = result.rows.map((meal) => ({
      id: meal.meal_id,
      name: meal.meal_name,
      description: meal.meal_description,
      image: `data:image/jpeg;base64,${meal.image_base64}`, // Construct image URL
      ingredients: meal.ingredients,
      recipe: meal.recipe_steps,
    }));

    res.status(200).json(meals);
  } catch (err) {
    console.error("Error fetching meals:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default gettingAllMeals;