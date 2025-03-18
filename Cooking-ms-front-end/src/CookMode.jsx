import React, { useState } from "react";
import InputSample from './InputSample.jsx';
import image from './assets/ugali-samaki.jpg';
import useFetchMeals from './hooks/useFetchMeals.jsx'

function CookMode() {
  const [studentNumber, setStudentNumber] = useState("");
  const { meals, loading, error } = useFetchMeals();

  const handleMessage = () => {
    alert("Message button clicked!");
  };

  if (loading) return <p>Loading meals...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="cook-container">
      {/* Message Icon */}
      <div className="ck-sms" onClick={handleMessage}>
        &#9993;
      </div>

      <h2>Hello and Welcome!</h2>
      <hr />

      {/* Inputs */}
      <div className="inputs">
        <InputSample label="Food name" type="text" />
        <InputSample
          label="Student No."
          type="number"
          value={studentNumber}
          onChange={(e) => setStudentNumber(e.target.value)}
        />
      </div>

      <div className="div-btn">
        <button type="submit">Generate Meal</button>
      </div>

      {/* Render Fetched Meals */}
      <div id="menu-holders">
        {meals.length > 0 ? (
          meals.map((meal) => (
            <FoodItem
              key={meal.id}
              name={meal.name}
              description={meal.description}
              image={meal.image}
              ingredients={meal.ingredients}
              recipe={meal.recipe}
            />
          ))
        ) : (
          <p>No meals available.</p>
        )}
      </div>

      <p>Meal Name for {studentNumber || "XXXX"} Student</p>
      <hr />

      {/* Ingredients Table */}
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
          {meals.length > 0 &&
            meals[0]?.ingredients.map((ingredient, index) => (
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

      <div className="div-btn">
        <button type="submit">Generate Recipe</button>
      </div>

      {/* Recipe Section */}
      <p className="recipe-grt">Recipe of foodname for {studentNumber || "XXXX"} Student</p>
      <hr />
      <div className="xt-area">
        <label htmlFor="ext-area">Follow this Guide</label>
        <textarea style={{ width: "100%", height: "150px" }}>
          {meals.length > 0 ? meals[0]?.recipe : "No recipe available."}
        </textarea>
      </div>
    </div>
  );
}

// FoodItem Component
function FoodItem({ name, description, image, ingredients, recipe }) {
  return (
    <div id="menu">
      <div className="pic-holder">
        <img src={image} alt={name} width="310px" height="250px" />
      </div>
      <div className="food-name">
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default CookMode;