import React, { useState } from 'react';
import axios from 'axios';
import './style.css'; // Import CSS for styling

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        roles:['User'],
        type:2 // 2 means its not from the postman or internal web
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state

    const { username, password, roles, type } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const url = 'https://visiting-lura-sdkgroup-184d32b4.koyeb.app/';
    // const url = 'http://localhost:3500/';

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(url+'users', {
                username,
                password,
                roles,type
            });
            console.log(res);
            setMessage('Registered successfully'); // Set success message
        } catch (err) {
            console.error(err.response.data);
            setMessage('Failed to register, User already exists'); // Set error message
        } finally {
            setLoading(false);  // Stop loading after the request completes
        }
    };

    return (
        <div className="auth-form">
            <h2>Register</h2>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Username" name="username" value={username} onChange={onChange} required />
                <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required />
                <button type="submit">Register</button>
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

export default Register;