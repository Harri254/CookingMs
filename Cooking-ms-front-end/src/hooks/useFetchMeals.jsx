import { useState, useEffect } from "react";
import axios from "axios";

const useFetchMeals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/meals");
        setMeals(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch meals");
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  return { meals, loading, error };
};

export default useFetchMeals;