import express from "express";
import cors from "cors";

// Import routes
import mealRoutes from "./routes/meal.routes.js";
import userRoutes from "./routes/user.routes.js";
import populationRoutes from "./routes/population.routes.js";

// Import database connection
import pool from './database.js'; // Adjust the path as needed

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use("/api/meals", mealRoutes);
app.use("/api/auth",userRoutes);
app.use("/api/population", populationRoutes);

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

app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal server error" });
  });

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});