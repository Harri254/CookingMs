import { useState } from "react";
import axios from "axios";

function NewMeal({ editingMeal, setEditingMeal }) {
  const [mealName, setMealName] = useState(editingMeal?.name || "");
  const [mealDescription, setMealDescription] = useState(editingMeal?.description || "");
  const [ingredientsList, setIngredientsList] = useState(editingMeal?.ingredientsList || []);
  const [newIngredientString, setNewIngredientString] = useState("");
  const [ratios, setRatios] = useState(editingMeal?.ratios || {});
  const [mainIngredients, setMainIngredients] = useState(editingMeal?.mainIngredients || {});
  const [recipe, setRecipe] = useState(editingMeal?.recipe || "");
  const [file, setFile] = useState(null);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [editedIngredientName, setEditedIngredientName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Add new ingredients to the list
  const handleAddIngredients = () => {
    if (!newIngredientString.trim()) return;
    const newIngredients = newIngredientString
      .split(/[,]/)
      .map((ingredient) => capitalizeFirstLetter(ingredient.trim()))
      .filter((ingredient) => ingredient !== "");
    const updatedIngredientsList = Array.from(new Set([...ingredientsList, ...newIngredients]));
    setIngredientsList(updatedIngredientsList);
    setNewIngredientString("");
  };

  // Delete an ingredient
  const handleDeleteIngredient = (ingredientToDelete) => {
    const updatedIngredientsList = ingredientsList.filter((ing) => ing !== ingredientToDelete);
    const updatedRatios = { ...ratios };
    delete updatedRatios[ingredientToDelete];
    const updatedMainIngredients = { ...mainIngredients };
    delete updatedMainIngredients[ingredientToDelete];
    setIngredientsList(updatedIngredientsList);
    setRatios(updatedRatios);
    setMainIngredients(updatedMainIngredients);
  };

  // Save changes to an edited ingredient name
  const handleSaveEdit = () => {
    if (!editedIngredientName.trim()) {
      alert("Ingredient name cannot be empty.");
      return;
    }
    if (ingredientsList.includes(editedIngredientName)) {
      alert("Ingredient already exists.");
      return;
    }
    const updatedIngredientsList = ingredientsList.map((ing) =>
      ing === editingIngredient ? editedIngredientName : ing
    );
    const updatedRatios = { ...ratios };
    updatedRatios[editedIngredientName] = updatedRatios[editingIngredient];
    delete updatedRatios[editingIngredient];
    const updatedMainIngredients = { ...mainIngredients };
    updatedMainIngredients[editedIngredientName] = updatedMainIngredients[editingIngredient];
    delete updatedMainIngredients[editingIngredient];
    setIngredientsList(updatedIngredientsList);
    setRatios(updatedRatios);
    setMainIngredients(updatedMainIngredients);
    setEditingIngredient(null);
    setEditedIngredientName("");
  };

  // Toggle main ingredient status
  const handleMainIngredientChange = (ingredient) => {
    setMainIngredients((prev) => ({
      ...prev,
      [ingredient]: !prev[ingredient],
    }));
  };

  // Handle ratio changes
  const handleRatioChange = (ingredient, value) => {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 10) {
      setRatios((prevRatios) => ({
        ...prevRatios,
        [ingredient]: parsedValue,
      }));
    }
  };

  // Validate ratio on blur
  const handleRatioBlur = (ingredient, value) => {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 10) {
      alert("Ratio must be between 0 and 10.");
      setRatios((prevRatios) => ({
        ...prevRatios,
        [ingredient]: 0,
      }));
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/") && selectedFile.size <= 5 * 1024 * 1024) {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please upload a valid image file (JPEG/PNG under 5MB).");
      setFile(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mealName || !mealDescription || ingredientsList.length === 0 || !recipe || !file) {
      setError("Please fill all required fields.");
      return;
    }
    const formData = new FormData();
    formData.append("mealName", mealName);
    formData.append("mealDescription", mealDescription);
    formData.append("ingredientsList", JSON.stringify(ingredientsList));
    formData.append("ratios", JSON.stringify(ratios));
    formData.append("mainIngredients", JSON.stringify(mainIngredients));
    formData.append("recipe", recipe);
    formData.append("image", file);

    try {
      const url = editingMeal
        ? `http://localhost:3000/api/meals/${editingMeal.id}`
        : "http://localhost:3000/api/meals/new";
      const method = editingMeal ? "put" : "post";
      const response = await axios[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data) {
        setMessage(editingMeal ? "Meal updated successfully!" : "Meal added successfully!");
        resetForm();
        if (setEditingMeal) setEditingMeal(null);
      }
    } catch (err) {
      console.error("Submission Error:", err);
      setError("Failed to save meal. Please check console for details.");
    }
  };

  // Reset form fields
  const resetForm = () => {
    setMealName("");
    setMealDescription("");
    setIngredientsList([]);
    setNewIngredientString("");
    setRatios({});
    setMainIngredients({});
    setRecipe("");
    setFile(null);
    setMessage("");
    setError("");
  };

  return (
    <div className="add-meal">
      <h4>{editingMeal ? "Edit Meal" : "Add New Meal"}</h4>
      <hr />
      {/* Meal Name */}
      <div className="meal-name">
        <label>Meal Name:</label>
        <input
          type="text"
          placeholder="Enter meal name"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
        />
      </div>
      {/* Meal Description */}
      <div className="meal-name">
        <label>Description:</label>
        <input
          type="text"
          placeholder="Enter meal description"
          value={mealDescription}
          onChange={(e) => setMealDescription(e.target.value)}
        />
      </div>
      {/* Ingredients Input */}
      <div className="ingredient-holder">
        <label>Enter Ingredients (comma):</label>
        <input
          type="text"
          placeholder="e.g., Rice, Beans Oil"
          value={newIngredientString}
          onChange={(e) => setNewIngredientString(e.target.value)}
        />
        <button onClick={handleAddIngredients}>Add Ingredients</button>
      </div>
      {/* Ratios Table */}
      {ingredientsList.length > 0 && (
        <table className="meal-table">
          <thead>
            <tr>
              <th>Ingredient Name</th>
              <th>Main Ingredient</th>
              <th>Ratio (0–10)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ingredientsList.map((ingredient) => (
              <tr key={ingredient}>
                <td>
                  {editingIngredient === ingredient ? (
                    <input
                      type="text"
                      value={editedIngredientName}
                      onChange={(e) => setEditedIngredientName(e.target.value)}
                    />
                  ) : (
                    ingredient
                  )}
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="checkbox-size"
                    checked={!!mainIngredients[ingredient]}
                    onChange={() => handleMainIngredientChange(ingredient)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    className="input-number"
                    value={ratios[ingredient] || 0}
                    onChange={(e) => handleRatioChange(ingredient, e.target.value)}
                    onBlur={(e) => handleRatioBlur(ingredient, e.target.value)}
                  />
                </td>
                <td>
                  {editingIngredient === ingredient ? (
                    <>
                      <button onClick={handleSaveEdit}>Save</button>
                      <button onClick={() => setEditingIngredient(null)}>Cancel</button>
                    </>
                  ) : (
                    <div className="actions">
                      <button onClick={() => {
                        setEditingIngredient(ingredient);
                        setEditedIngredientName(ingredient);
                      }}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteIngredient(ingredient)}>
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Image Upload */}
      <div className="image-holder">
        <label>Upload your meal picture:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
      {/* Recipe Input */}
      <div className="txt-area">
        <label htmlFor="recipe">Enter the Recipe:</label>
        <textarea
          name="recipe"
          id="recipe"
          cols="30"
          rows="10"
          placeholder="Describe how to prepare the meal"
          value={recipe}
          onChange={(e) => setRecipe(e.target.value)}
        ></textarea>
      </div>
      {/* Submit Button */}
      <div className="add-meal-btn">
        <button type="submit" onClick={handleSubmit}>
          {editingMeal ? "Update Meal" : "Add Meal"}
        </button>
        {message && <p style={{ color: "green" }}>{message}</p>}
      </div>
    </div>
  );
}

export default NewMeal;