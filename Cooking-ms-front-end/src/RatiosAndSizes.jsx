import React, { useState, useEffect } from "react";
import axios from "axios";
import NewMeal from "./NewMeal"; // Import the NewMeal component
import './RatioAndSizes.css';

function RatiosAndSizes() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);

  // Fetch all meals
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/meals");
        setMeals(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching meals:", err);
        setError("Failed to fetch meals. Please check your connection.");
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  // Fetch a specific meal for editing
  const handleEditMeal = async (mealId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/meals/${mealId}`);
      setEditingMeal(response.data);
    } catch (err) {
      console.error("Error fetching meal:", err);
      alert("Failed to fetch meal. Please check console for details.");
    }
  };

  // Handle deleting a meal
  const handleDeleteMeal = async (mealId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/meals/${mealId}`);
      if (response.data) {
        setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== mealId));
        alert("Meal deleted successfully!");
      }
    } catch (err) {
      console.error("Error deleting meal:", err.response?.data || err.message);
      alert("Failed to delete meal. Please check console for details.");
    }
  };

  return (
    <div className="ratios-and-sizes-container">
      {/* Meal List */}
      <div className="section">
        <h4>Available Meals</h4>
        <hr />
        {loading ? (
          <p style={{ textAlign: "center", fontSize: "1.2rem" }}>Loading meals...</p>
        ) : error ? (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        ) : meals.length > 0 ? (
          <div className="meal-list">
            {meals.map((meal) => (
              <div key={meal.id} className="meal-card">
                <img src={meal.image} alt={meal.name} className="meal-image" />
                <div className="meal-details">
                  <h3>{meal.name}</h3>
                  <p>{meal.description}</p>
                  <div className="meal-actions">
                    <button onClick={() => handleEditMeal(meal.id)}>Edit</button>
                    <button onClick={() => handleDeleteMeal(meal.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>No meals found.</p>
        )}
      </div>

      {/* Edit Meal Form */}
      {editingMeal && (
        <NewMeal editingMeal={editingMeal} setEditingMeal={setEditingMeal} />
      )}
    </div>
  );
}

export default RatiosAndSizes;