import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getApiUrl } from '../config/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch(getApiUrl('/api/auth/me'), { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                if (data && (data._id || data.id)) {
                    setUser(data);
                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error(error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        let res, data;
        try {
            res = await fetch(getApiUrl('/api/auth/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });
            data = await res.json();
        } catch (err) {
            throw new Error("Unable to connect to the server. Please try again.");
        }

        if (res.ok) {
            localStorage.setItem('token', data.token);
            setUser(data.user);
            navigate('/');
        } else {
            if (res.status === 401 || (res.status === 400 && data.error === "Invalid credentials.")) {
                throw new Error("Invalid email or password.");
            }
            if (res.status === 429 || data.error === "RATE_LIMIT") {
                window.dispatchEvent(new CustomEvent('show-toast', { detail: "Too many login attempts. Please wait a few minutes and try again." }));
                throw new Error("Too many login attempts. Please wait a few minutes and try again.");
            }
            if (res.status >= 500) {
                throw new Error("Something went wrong on the server. Please try again.");
            }
            throw new Error(data.error || 'Login failed');
        }
    };

    const register = async (name, email, password) => {
        let res, data;
        try {
            res = await fetch(getApiUrl('/api/auth/register'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, email, password })
            });
            data = await res.json();
        } catch (err) {
            throw new Error("Unable to connect to the server. Please try again.");
        }

        if (res.ok) {
            navigate('/login');
        } else {
            if (res.status === 429 || data.error === "RATE_LIMIT") {
                window.dispatchEvent(new CustomEvent('show-toast', { detail: "Too many registration attempts. Please wait a few minutes and try again." }));
                throw new Error("Too many registration attempts. Please wait a few minutes and try again.");
            }
            if (res.status >= 500) {
                throw new Error("Something went wrong on the server. Please try again.");
            }
            throw new Error(data.error || 'Registration failed');
        }
    };

    const logout = async () => {
        await fetch(getApiUrl('/api/auth/logout'), { method: 'POST', credentials: 'include' });
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
