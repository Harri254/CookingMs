import pool from "../../database.js";

const updatingMeal = async (req, res) => {
  try {
    const mealId = req.params.id;
    const {
      mealName,
      mealDescription,
      ingredientsList,
      ratios,
      mainIngredients,
      recipe,
    } = req.body;
    const image = req.file ? req.file.buffer : null;

    let query, values;

    if (image) {
      query = `
        UPDATE "Meal"
        SET name = $1, description = $2, ingredients_list = $3, ratios = $4, main_ingredients = $5, recipe = $6, image_data = $7
        WHERE id = $8
        RETURNING id
      `;
      values = [
        mealName,
        mealDescription,
        ingredientsList,
        ratios,
        mainIngredients,
        recipe,
        image,
        mealId,
      ];
    } else {
      query = `
        UPDATE "Meal"
        SET name = $1, description = $2, ingredients_list = $3, ratios = $4, main_ingredients = $5, recipe = $6
        WHERE id = $7
        RETURNING id
      `;
      values = [
        mealName,
        mealDescription,
        ingredientsList,
        ratios,
        mainIngredients,
        recipe,
        mealId,
      ];
    }

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Meal not found" });
    }

    res.status(200).json({ message: "Meal updated successfully" });
  } catch (err) {
    console.error("Error updating meal:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default updatingMeal;