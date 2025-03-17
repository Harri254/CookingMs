import { useState } from "react";
import axios from "axios";

function NewMeal() {
    const [mealName, setMealName] = useState("");
    const [ingredientsList, setIngredientsList] = useState([]);
    const [newIngredientString, setNewIngredientString] = useState(""); // Input string for ingredients
    const [ratios, setRatios] = useState({});
    const [mainIngredients, setMainIngredients] = useState({});
    const [recipe, setRecipe] = useState("");
    const [file, setFile] = useState(null); // For photo upload
    const [editingIngredient, setEditingIngredient] = useState(null); // Track which ingredient is being edited

    // Handle adding new ingredients to the list
    const handleAddIngredients = () => {
        if (newIngredientString.trim() !== "") {
            // Split the input string by commas or spaces
            const newIngredients = newIngredientString
                .split(/[, ]+/) // Split by comma or space
                .map((ingredient) => capitalizeFirstLetter(ingredient.trim())) // Trim whitespace and capitalize
                .filter((ingredient) => ingredient !== ""); // Remove empty strings

            // Add only unique ingredients
            const updatedIngredientsList = Array.from(
                new Set([...ingredientsList, ...newIngredients])
            );

            setIngredientsList(updatedIngredientsList);
            setNewIngredientString(""); // Clear the input field
        }
    };

    // Capitalize the first letter of a string
    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    // Handle deleting an ingredient
    const handleDeleteIngredient = (ingredientToDelete) => {
        // Filter out the ingredient to delete
        const updatedIngredientsList = ingredientsList.filter(
            (ingredient) => ingredient !== ingredientToDelete
        );

        // Remove ratio and main ingredient status for the deleted ingredient
        const updatedRatios = { ...ratios };
        delete updatedRatios[ingredientToDelete];

        const updatedMainIngredients = { ...mainIngredients };
        delete updatedMainIngredients[ingredientToDelete];

        setIngredientsList(updatedIngredientsList);
        setRatios(updatedRatios);
        setMainIngredients(updatedMainIngredients);
    };

    // Handle saving an edited ingredient name
    const handleSaveEdit = (oldName, newName) => {
        if (!newName.trim()) {
            alert("Ingredient name cannot be empty.");
            return;
        }

        if (ingredientsList.includes(newName)) {
            alert("Ingredient already exists.");
            return;
        }

        // Replace the old ingredient name with the new one
        const updatedIngredientsList = ingredientsList.map((ingredient) =>
            ingredient === oldName ? capitalizeFirstLetter(newName) : ingredient
        );

        // Update ratios and main ingredients
        const updatedRatios = { ...ratios };
        updatedRatios[capitalizeFirstLetter(newName)] = updatedRatios[oldName];
        delete updatedRatios[oldName];

        const updatedMainIngredients = { ...mainIngredients };
        updatedMainIngredients[capitalizeFirstLetter(newName)] =
            updatedMainIngredients[oldName];
        delete updatedMainIngredients[oldName];

        setIngredientsList(updatedIngredientsList);
        setRatios(updatedRatios);
        setMainIngredients(updatedMainIngredients);
        setEditingIngredient(null); // Exit edit mode
    };

    // Handle ratio changes
    const handleRatioChange = (ingredient, value) => {
        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 10) { // Validate ratio
            setRatios((prevRatios) => ({
                ...prevRatios,
                [ingredient]: parsedValue,
            }));
        }
    };

    // Handle checkbox changes for main ingredients
    const handleMainIngredientChange = (ingredient) => {
        setMainIngredients((prev) => ({
            ...prev,
            [ingredient]: !prev[ingredient], // Toggle the checkbox value
        }));
    };

    // Handle file upload
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith("image/")) { // Ensure it's an image
            // setFile(selectedFile);
        } else {
            alert("Please upload a valid image file.");
        }
    };

    // Handle form submission
    const handleSubmit = async(e) => {
        e.preventDefault();

        // Validate required fields
        if (!mealName.trim()) {
            alert("Please enter a meal name.");
            return;
        }
        if (ingredientsList.length === 0) {
            alert("Please add at least one ingredient.");
            return;
        }

        // Prepare the meal data object
        const mealData = {
            mealName,
            ingredients: ingredientsList
                .filter((ingredient) => mainIngredients[ingredient]) // Include only main ingredients
                .map((ingredient) => ({
                    name: ingredient,
                    ratio: ratios[ingredient] || 0, // Only include ratios for main ingredients
                    isMain: true,
                })),
            recipe: recipe.trim(),
            file: file ? file.name : "No file uploaded", // Include file name
        };
        try {
            const response =await axios.post('http://localhost:3000/api/meals/new',{});
        } catch (err) {
            console.error(err.message)
        }
        // Log the meal data (you can replace this with an API call)
        console.log("Meal Data:", mealData);

        // Reset the form
        setMealName("");
        setIngredientsList([]);
        setNewIngredientString("");
        setRatios({});
        setMainIngredients({});
        setRecipe("");
        setFile(null); // Clear the file input
    };

    return (
        <div className="add-meal">
            <h4>Add new meal here!</h4>
            <hr />
            {/* Meal Name Input */}
            <div className="meal-name">
                <label>Meal Name:</label>
                <input
                    type="text"
                    placeholder="Enter meal name"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                />
            </div>

            {/* Ingredient Input */}
            <div className="ingredient-holder">
                <label>Enter Ingredients (comma or space separated):</label>
                <input
                    type="text"
                    placeholder="e.g., Rice, Beans Oil"
                    value={newIngredientString}
                    onChange={(e) => setNewIngredientString(e.target.value)}
                />
                <button onClick={handleAddIngredients} className="add-ingred">Add Ingredients</button>
            </div>

            {/* Ratios Table */}
            {ingredientsList.length > 0 && (
                <table className="meal-table">
                    <thead>
                        <tr>
                            <th>Ingredient Name</th>
                            <th>Main Ingredient</th>
                            <th>Ratio (0-10)</th>
                            <th>Actions</th> {/* Actions Column */}
                        </tr>
                    </thead>
                    <tbody>
                        {ingredientsList.map((ingredient) => (
                            <tr key={ingredient}>
                                <td>
                                    {editingIngredient === ingredient ? (
                                        <input
                                            type="text"
                                            defaultValue={ingredient}
                                            style={{
                                                width: `${Math.max(
                                                    100,
                                                    ingredient.length * 10
                                                )}px`, // Dynamically adjust width
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleSaveEdit(
                                                        ingredient,
                                                        e.target.value
                                                    );
                                                }
                                            }}
                                            onChange={(e) => {
                                                e.target.style.width = `${Math.max(
                                                    100,
                                                    e.target.value.length * 10
                                                )}px`; // Expand input width dynamically
                                            }}
                                        />
                                    ) : (
                                        ingredient
                                    )}
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={mainIngredients[ingredient] || false}
                                        onChange={() =>
                                            handleMainIngredientChange(ingredient)
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={ratios[ingredient] || 0}
                                        onChange={(e) =>
                                            handleRatioChange(
                                                ingredient,
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    {editingIngredient === ingredient ? (
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleSaveEdit(
                                                        ingredient,
                                                        document.querySelector(
                                                            `input[type="text"]`
                                                        ).value
                                                    )
                                                }
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setEditingIngredient(null)
                                                }
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() =>
                                                    setEditingIngredient(ingredient)
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteIngredient(ingredient)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Photo Upload */}
            <div className="image-holder">
                <label>Upload your meal picture:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                {file && <p>Selected file: {file.name}</p>} {/* Show selected file name */}
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
            <button
                type="submit"
                id="save-meal"
                onClick={handleSubmit}
            >
                Save Meal
            </button>
        </div>
    );
}

export default NewMeal;