import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Auth.css';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submittingRef = React.useRef(false);
    const { register } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submittingRef.current) return;
        submittingRef.current = true;
        setIsSubmitting(true);
        setError(null);
        try {
            await register(name, email, password);
        } catch (err) {
            setError(err.message);
            submittingRef.current = false;
            setIsSubmitting(false);
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
                        disabled={isSubmitting}
                        required 
                    />
                    <input 
                        type="email" 
                        className="auth-input"
                        placeholder="Email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        disabled={isSubmitting}
                        required 
                    />
                    <input 
                        type="password" 
                        className="auth-input"
                        placeholder="Password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        disabled={isSubmitting}
                        required 
                    />
                    <button type="submit" className="auth-button" disabled={isSubmitting}>
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="auth-link-text">
                    Already have an account? <Link to="/login" className="auth-link">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
