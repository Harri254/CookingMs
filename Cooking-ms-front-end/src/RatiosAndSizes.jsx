import React, { useState, useEffect } from "react";
import axios from "axios";
import NewMeal from "./NewMeal"; // Import the NewMeal component
import './RatioAndSizes.css';

function RatiosAndSizes() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);

  // New states for population settings
  const [studentNumber, setStudentNumber] = useState("");
  const [teacherNumber, setTeacherNumber] = useState("");
  const [totalPopulation, setTotalPopulation] = useState(0);
  const [message, setMessage] = useState("");
  const [populationError, setPopulationError] = useState("");

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

  // Fetch population settings on component load
  useEffect(() => {
    const fetchPopulationSettings = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/population");
        if (response.data) {
          setStudentNumber(response.data.studentcount.toString());
          setTeacherNumber(response.data.teachercount.toString());
          setTotalPopulation(response.data.studentcount + response.data.teachercount);
        }
      } catch (err) {
        console.error("Error fetching population settings:", err);
        setPopulationError("Failed to fetch population settings. Please try again.");
      }
    };

    fetchPopulationSettings();
  }, []);

  // Save population settings
  const savePopulationSettings = async () => {
    try {
      const parsedStudentCount = parseInt(studentNumber, 10) || 0;
      const parsedTeacherCount = parseInt(teacherNumber, 10) || 0;

      const response = await axios.post("http://localhost:3000/api/population", {
        studentCount: parsedStudentCount,
        teacherCount: parsedTeacherCount,
      });

      if (response.data) {
        setMessage("Population settings saved successfully!");
        setPopulationError("");
        setTotalPopulation(parsedStudentCount + parsedTeacherCount);
      }
    } catch (err) {
      console.error("Error saving population settings:", err);
      setPopulationError("Failed to save population settings. Please check console for details.");
      setMessage("");
    }
  };

  // Fetch a specific meal for editing
  const handleEditMeal = async (mealId) => {
    try {
      if (!mealId || isNaN(mealId)) {
        alert("Invalid meal ID");
        return;
      }

      const response = await axios.get(`http://localhost:3000/api/meals/${mealId}`);
      setEditingMeal(response.data);
    } catch (err) {
      console.error("Error fetching meal:", err.response?.data || err.message);
      alert("Failed to fetch meal. Please check console for details.");
    }
  };

  // Handle deleting a meal
  const handleDeleteMeal = async (mealId) => {
    try {
      if (!mealId || isNaN(mealId)) {
        alert("Invalid meal ID");
        return;
      }

      // Confirm deletion with the user
      const confirmDelete = window.confirm("Are you sure you want to delete this meal?");
      if (!confirmDelete) return;

      const response = await axios.delete(`http://localhost:3000/api/meals/${mealId}`);
      console.log("Delete Response:", response.data); // Log the delete response

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

      {/* Population Settings Section */}
      <div className="population-settings-section">
        <h4>Set Population</h4>
        <hr />

        {/* Student Input */}
        <div className="input-group">
          <label>Number of Students:</label>
          <input
            type="number"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            min="0"
          />
        </div>

        {/* Teacher Input */}
        <div className="input-group">
          <label>Number of Teachers:</label>
          <input
            type="number"
            value={teacherNumber}
            onChange={(e) => setTeacherNumber(e.target.value)}
            min="0"
          />
        </div>

        {/* Total Population Display */}
        <div className="total-population">
          <p>Total Population: {totalPopulation}</p>
        </div>

        {/* Save Button */}
        <div className="save-p">
          <button onClick={savePopulationSettings}>Save Population Settings</button>
        </div>
        

        {/* Messages */}
        {message && <p style={{ color: "green" }}>{message}</p>}
        {populationError && <p style={{ color: "red" }}>{populationError}</p>}
      </div>

      {/* Edit Meal Form */}
      {editingMeal && (
        <NewMeal editingMeal={editingMeal} setEditingMeal={setEditingMeal} />
      )}
    </div>
  );
}

export default RatiosAndSizes;