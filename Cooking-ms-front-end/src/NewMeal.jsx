import { useState } from "react";
import axios from "axios";
import "./NewMeal.css"; // Import CSS for styling

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
      <div className="form-group">
        <label htmlFor="mealName">Meal Name:</label>
        <input
          type="text"
          id="mealName"
          placeholder="Enter meal name"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          aria-label="Meal Name"
        />
      </div>

      {/* Meal Description */}
      <div className="form-group">
        <label htmlFor="mealDescription">Description:</label>
        <input
          type="text"
          id="mealDescription"
          placeholder="Enter meal description"
          value={mealDescription}
          onChange={(e) => setMealDescription(e.target.value)}
          aria-label="Meal Description"
        />
      </div>

      {/* Ingredients Input */}
      <div className="form-group">
        <label htmlFor="ingredients">Enter Ingredients (comma-separated):</label>
        <div className="ingredient-input">
          <input
            type="text"
            id="ingredients"
            placeholder="e.g., Rice, Beans, Oil"
            value={newIngredientString}
            onChange={(e) => setNewIngredientString(e.target.value)}
            aria-label="Add Ingredients"
          />
          <button onClick={handleAddIngredients} aria-label="Add Ingredients">
            Add Ingredients
          </button>
        </div>
      </div>

      {/* Ratios Table */}
      {ingredientsList.length > 0 && (
        <table className="meal-table">
          <caption>Ingredient Details</caption>
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
                      aria-label={`Edit Ingredient ${ingredient}`}
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
                    aria-label={`Toggle Main Ingredient for ${ingredient}`}
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
                    aria-label={`Set Ratio for ${ingredient}`}
                  />
                </td>
                <td>
                  {editingIngredient === ingredient ? (
                    <>
                      <button onClick={handleSaveEdit} aria-label={`Save Changes for ${ingredient}`}>
                        Save
                      </button>
                      <button onClick={() => setEditingIngredient(null)} aria-label="Cancel Editing">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <div className="actions">
                      <button
                        onClick={() => {
                          setEditingIngredient(ingredient);
                          setEditedIngredientName(ingredient);
                        }}
                        aria-label={`Edit Ingredient ${ingredient}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteIngredient(ingredient)}
                        aria-label={`Delete Ingredient ${ingredient}`}
                      >
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
      <div className="form-group">
        <label htmlFor="mealImage">Upload your meal picture:</label>
        <input
          type="file"
          id="mealImage"
          accept="image/*"
          onChange={handleFileChange}
          aria-label="Upload Meal Image"
        />
        {error && <p className="error-message">{error}</p>}
      </div>

      {/* Recipe Input */}
      <div className="form-group">
        <label htmlFor="recipe">Enter the Recipe:</label>
        <textarea
          id="recipe"
          cols="30"
          rows="10"
          placeholder="Describe how to prepare the meal"
          value={recipe}
          onChange={(e) => setRecipe(e.target.value)}
          aria-label="Meal Recipe"
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="form-group">
        <button type="submit" onClick={handleSubmit} aria-label={editingMeal ? "Update Meal" : "Add Meal"}>
          {editingMeal ? "Update Meal" : "Add Meal"}
        </button>
        {message && <p className="success-message">{message}</p>}
      </div>
    </div>
  );
}

export default NewMeal;