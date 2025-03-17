import React, { useState } from "react";
import InputSample from './InputSample.jsx';
import image from './assets/ugali-samaki.jpg';

function CookMode() {
  const [studentNumber, setStudentNumber] = useState("");

  const handleMessage = () => {
    alert("Message button clicked!");
  };

  return (
    <div className="cook-container">
      <div className="ck-sms" onClick={handleMessage}>
        &#9993;
      </div>

      <h2>Hello and Welcome!</h2>
      <hr />
      <div className="inputs">
        <InputSample label="Food name" type="text" />
        <InputSample label="Student No." type="number" />
      </div>
      <div className="div-btn">
        <button type="submit">Generate Meal</button>
      </div>
      <div id="menu-holders">
        <FoodItem />
        <FoodItem />
        <FoodItem />
        <FoodItem />
        <FoodItem />
      </div>
      <p>Meal Name for {studentNumber || "XXXX"} Student</p>
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
          <tr>
            <td>Beans</td>
            <td>3kg</td>
            <td>
              <input type="checkbox" id="beans-available" aria-label="Beans available" />
            </td>
          </tr>
          <tr>
            <td>Rice</td>
            <td>3kg</td>
            <td>
              <input type="checkbox" id="rice-available" aria-label="Rice available" />
            </td>
          </tr>
          <tr>
            <td>Meat</td>
            <td>3kg</td>
            <td>
              <input type="checkbox" id="meat-available" aria-label="Meat available" />
            </td>
          </tr>
          <tr>
            <td>Oil</td>
            <td>3kg</td>
            <td>
              <input type="checkbox" id="oil-available" aria-label="Oil available" />
            </td>
          </tr>
          <tr>
            <td>Salt</td>
            <td>3kg</td>
            <td>
              <input type="checkbox" id="salt-available" aria-label="Salt available" />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="div-btn">
        <button type="submit">Generate Recipe</button>
      </div>
      <p className="recipe-grt">Recipe of foodname for {studentNumber || "XXXX"} Student</p>
      <hr />
      <div className="xt-area">
        <label htmlFor="ext-area">Follow this Guide</label>
        <textarea style={{ width: "100%", height: "150px" }}></textarea>
      </div>
    </div>
  );
}
function FoodItem(){
  return (
    <div id="menu">
      <div className="pic-holder">
        <img src={image} alt="Food image" width="310px" height="250px"/>
      </div>
      <div className="food-name">
        <h3>Ugali and Fish</h3>
      </div>
    </div>
  );
}

export default CookMode;