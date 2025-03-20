import React, { useState } from "react";
import InputSample from './InputSample.jsx';
import useFetchMeals from './hooks/useFetchMeals.jsx';
import './cookMode.css';

function CookMode() {
  const [searchTerm, setSearchTerm] = useState(""); // For searching meals
  const [selectedMeal, setSelectedMeal] = useState(null); // Track the selected meal
  const [studentNumber, setStudentNumber] = useState(""); // For scaling quantities
  const [recipe, setRecipe] = useState(""); // To store the fetched recipe
  const { meals, loading, error } = useFetchMeals();

  if (loading) return <p>Loading meals...</p>;
  if (error) return <p>{error}</p>;

  // Filter meals based on the search term
  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle meal selection
  const handleMealSelect = (meal) => {
    setSelectedMeal(meal);
    setRecipe(""); // Reset recipe when a new meal is selected
  };

  // Fetch recipe for the selected meal
  const fetchRecipe = async () => {
    if (!selectedMeal) {
      alert("Please select a meal first.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/meals/${selectedMeal.id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Backend Response:", data); // Log the response for debugging
      setRecipe(data.recipe || "No recipe available.");
    } catch (err) {
      console.error("Error fetching recipe:", err);
      alert("Failed to fetch recipe. Please check console for details.");
    }
  };

  return (
    <div className="cook-container">
      {/* Message Icon */}
      <div className="ck-sms" onClick={() => alert("Message button clicked!")}>
        &#9993;
      </div>

      <h2>Hello and Welcome!</h2>
      <hr />

      {/* Search Input */}
      <div className="inputs">
        <InputSample
          label="Search Meal"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <InputSample
          label="Student No."
          type="number"
          value={studentNumber}
          onChange={(e) => setStudentNumber(e.target.value)}
        />
      </div>

      {/* Meal List */}
      <div className="meal-grid">
        {filteredMeals.length > 0 ? (
          filteredMeals.map((meal) => (
            <div
              key={meal.id}
              className={`meal-item ${selectedMeal?.id === meal.id ? "selected" : ""}`}
              onClick={() => handleMealSelect(meal)}
            >
              <div className="meal-content">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="meal-image"
                />
                <div className="meal-text">
                  <h3>{meal.name}</h3>
                  <p>{meal.description}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No meals found.</p>
        )}
      </div>

      {/* Ingredients Table */}
      {selectedMeal && (
        <>
          <p>{selectedMeal.name} for {studentNumber || "XXXX"} Student</p>
          <hr />
          <p className="ingred">Ingredients</p>
          <table className="id-cook-mode">
            <thead>
              <tr>
                <th>Name of Ingredient</th>
                <th>Quantity</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {selectedMeal.ingredients.map((ingredient, index) => (
                <tr key={index}>
                  <td>{ingredient.ingredientName}</td>
                  <td>{`${(ingredient.dependencyRatio * studentNumber) || 0} ${ingredient.unit}`}</td>
                  <td>
                    <input
                      type="checkbox"
                      id={`${ingredient.ingredientName}-available`}
                      aria-label={`${ingredient.ingredientName} available`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Generate Recipe Button */}
      {selectedMeal && (
        <div className="div-btn">
          <button type="button" onClick={fetchRecipe}>
            Generate Recipe
          </button>
        </div>
      )}

      {/* Recipe Section */}
      {selectedMeal && (
        <>
          <p className="recipe-grt">Recipe of {selectedMeal.name} for {studentNumber || "XXXX"} Student</p>
          <hr />
          <div className="xt-area">
            <label htmlFor="ext-area">Follow this Guide</label>
            <textarea style={{ width: "100%", height: "150px" }} readOnly value={recipe}></textarea>
          </div>
        </>
      )}
    </div>
  );
}

export default CookMode;