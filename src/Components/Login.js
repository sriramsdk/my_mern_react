// require('dotenv').config();
import React, { useState } from 'react';
import axios from 'axios'; 
import './style.css'; // Import CSS for styling

const Login = ({ setLoggedInUser, setLoggedInRole }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state

    
    const { username, password } = formData;

    const onChange = e => setFormData({
        ...formData, 
        [e.target.name]: e.target.value
    });
    
    const url = process.env.REACT_APP_API_URL;

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);  // Start loading when the form is submitted
        console.log(url);
        try {
            const res = await axios.post(url + 'login', { username, password });
            // console.log(res.data.user_details);
            const userRole = res.data.user_details.user.role[0]; // Get the user's role
            const user_id = res.data.user_details.user.id;
            // console.log(userRole);
            if (res.data.token.length !== '') {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user_id', user_id);
                localStorage.setItem('user', username);
                localStorage.setItem('role', userRole);
                setLoggedInUser(username);
                setLoggedInRole(userRole);

                setMessage('Logged in successfully');
            } else {
                setMessage('Something Went Wrong');
            }
        } catch (err) {
            // console.error(err.response);
            setMessage('Failed to login - wrong credentials');
        } finally {
            setLoading(false);  // Stop loading after the request completes
        }
    };

    return (
        <div className="auth-form">
            <h2>Login</h2>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={username}
                    onChange={onChange}
                    required
                    disabled={loading} // Disable input during loading
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                    disabled={loading} // Disable input during loading
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            {/* Show loader when loading is true */}
            {loading && (
                <div className="overlay">
                    <div className="loader"></div>
                </div>
            )}

            <p className="message">{message}</p>
        </div>
    );
};

export default Login;
