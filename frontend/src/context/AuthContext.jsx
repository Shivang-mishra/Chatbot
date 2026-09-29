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
        const res = await fetch(getApiUrl('/api/auth/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            setUser(data.user);
            navigate('/');
        } else {
            throw new Error(data.error || 'Login failed');
        }
    };

    const register = async (name, email, password) => {
        const res = await fetch(getApiUrl('/api/auth/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (res.ok) {
            navigate('/login');
        } else {
            throw new Error(data.error || 'Registration failed');
        }
    };

    const logout = async () => {
        await fetch(getApiUrl('/api/auth/logout'), { method: 'POST', credentials: 'include' });
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
