import axios from "axios";
import { useState, useEffect } from "react";
import "./ManageUsers.css"; // Import CSS for styling

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(""); // State to track errors

  // Fetch users from the API
  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/auth/mngUsers");
      setUsers(response.data);
    } catch (err) {
      console.error(err.message);
      setError("Failed to fetch users. Please try again later.");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Handle user deletion
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/api/auth/mngUsers/del/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId)); // Update state immutably
    } catch (err) {
      console.error(err.message);
      setError("Failed to delete user. Please try again later.");
    }
  };

  return (
    <div className="manage-users">
      <h2>Configure the Users</h2>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* User Table */}
      <table className="users-table">
        <caption>Available Users:</caption>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Dynamically render table rows */}
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id || "N/A"}</td> {/* Display name or fallback */}
                <td>{user.email}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user.id)}
                    aria-label={`Delete user ${user.email}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No users available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManageUsers;