import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function CreateAccount() {
    // Correct usage of useState
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [adminId, setAdminId] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields are filled
        if (!id || !password || !email || !adminId || !adminPassword) {
            setError('Please fill in all fields');
            return;
        }

        try {
            // Send POST request to the backend
            const response = await axios.post('http://localhost:3000/api/auth/addUser', {
                id,
                password,
                email,
                adminId,
                adminPassword,
            });

            console.log(response);

            if(response.data){
                setMessage("Submission successful");

                // navigate('/admin');
            }
        } catch (error) {
            console.error('Submission error:', error.message);
        }
    };

    return (
        <div className="ca-main-div">
            <form id="ca-form" onSubmit={handleSubmit}>

                <p className="para">Hello and Welcome!</p>

                {/* Cook's Details Section */}
                <h3>Cook's Details</h3>
                <hr />
                <div className="cook-details">
                    <label htmlFor="full-name">Enter Your First Name:</label>
                    <input
                        type="text"
                        id="full-name"
                        value={id}
                        onChange={(e) => {
                            setId(e.target.value);
                            setError('');
                        }}
                        required
                        aria-label="First Name"
                    />
                </div>
                <div>
                    <label htmlFor="email">Enter Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                        }}
                        required
                        aria-label="Email"
                    />
                </div>
                <div>
                    <label htmlFor="password">Enter Id Number:</label>
                    <input
                        type="text"
                        id="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        required
                        aria-label="Password"
                    />
                </div>

                {/* Admin Authentication Section */}
                <h3>Admin Authentication</h3>
                <hr />
                <div>
                    <label htmlFor="admin-username">Enter Username:</label>
                    <input
                        type="text"
                        id="admin-username"
                        value={adminId}
                        onChange={(e) => {
                            setAdminId(e.target.value);
                            setError('');
                        }}
                        required
                        aria-label="Admin Username"
                    />
                </div>
                <div>
                    <label htmlFor="admin-password">Enter Password:</label>
                    <input
                        type="password"
                        id="admin-password"
                        value={adminPassword}
                        onChange={(e) => {
                            setAdminPassword(e.target.value);
                            setError('');
                        }}
                        required
                        aria-label="Admin Password"
                    />
                </div>

                {/* Display error message */}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {message && <p style={{ color: 'blue', fontSize: '18px' }}>{message}</p>}
                {/* Submit Button */}
                <div className="ca-btn">
                    <button type="submit" id="ca-btn">
                        Add Cook
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateAccount;