import axios from "axios";
import { useState, useEffect } from "react";

function ManageUsers() {
    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/auth/mngUsers');
            setUsers(response.data); 
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        getUsers();
    }, []); 

 
    const handleDelete = async (userId) => {
        const id = userId;
        try {
            await axios.delete(`http://localhost:3000/api/auth/mngUsers/del/${id}`);
            
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="manage-users">
            <h2>Configure the Users</h2>
            <table border="1">
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
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => handleDelete(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManageUsers;