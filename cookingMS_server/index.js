import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

// Import routes
import mealRoutes from "./routes/meal.routes.js";
import userRoutes from "./routes/user.routes.js";

// Import database connection
import pool from './database.js'; // Adjust the path as needed

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(fileUpload())

// Routes
app.use("/api/meals", mealRoutes);
app.use("/api/auth",userRoutes);

// Test database connection
async function testConnection() {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('Database connection successful:', result.rows[0]);
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

testConnection(); // Call the function to test the connection

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});