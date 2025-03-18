import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!id || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            console.log("Captured values:", id, password);
            const response = await axios.post('http://localhost:3000/api/auth/login', {id, password});

            console.log(response);

            if (response.data.role === 'admin') {
                navigate('/admin'); // Redirect to admin dashboard
            } else if (response.data.role === 'chef') {
                navigate('admin/cook-mode'); // Redirect to user dashboard
            }
        } catch (error) {
            console.error('Login error:', error.response?.data?.error || error.message); // Log the full error
            setError(error.response?.data?.error || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="form">
            <form id="form" onSubmit={handleSubmit}>
                <h2>Sign In:</h2>
                
                <div className="UN labels">
                    <label htmlFor="username">Enter Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={id}
                        onChange={(e) => {
                            setId(e.target.value);
                            setError('');
                        }}
                        required
                    />
                </div>
                <div className="pS labels">
                    <label htmlFor="password">Enter Password:</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        required
                    />
                </div>
                <input type="submit" value="Log In" id="btn" />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className="others">
                    <p className="forgetPassword">
                        <Link to="/forgot-password">Forget Password</Link>
                    </p>
                    <p className="createAccount">
                        <Link to="/create-account">Create Account</Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default Login;