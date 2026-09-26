import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Auth.css';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { register } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Register</h2>
                {error && <div className="auth-error">{error}</div>}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        className="auth-input"
                        placeholder="Name" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        required 
                    />
                    <input 
                        type="email" 
                        className="auth-input"
                        placeholder="Email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        className="auth-input"
                        placeholder="Password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                    />
                    <button type="submit" className="auth-button">Register</button>
                </form>
                <p className="auth-link-text">
                    Already have an account? <Link to="/login" className="auth-link">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
