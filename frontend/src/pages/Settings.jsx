import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Seperation from '../components/seperation/Seperation';

function Settings() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Manage darkmode state across the app
    const [mode, setMode] = useState(() => {
        return localStorage.getItem('theme-preference') || 'darkmode';
    });

    useEffect(() => {
        document.body.className = mode;
        localStorage.setItem('theme-preference', mode);
    }, [mode]);

    const toggleTheme = () => {
        setMode(prev => prev === 'darkmode' ? 'lightmode' : 'darkmode');
    };

    return (
        <div className="chatbot-container">
            <Sidebar />
            <Seperation />
            <div style={{ flex: 1, backgroundColor: 'var(--background-color)', color: 'var(--color)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '50px' }}>
                    <h2 style={{ marginBottom: '30px' }}>Settings</h2>
                    
                    <div style={{ marginBottom: '40px', backgroundColor: 'var(--btn-background-color)', padding: '20px', borderRadius: '10px' }}>
                        <h3 style={{ marginBottom: '15px', color: 'var(--gradient-color)' }}>Appearance</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>Theme Preference</span>
                            <button 
                                onClick={toggleTheme}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '5px',
                                    border: 'none',
                                    backgroundColor: 'var(--bg-color)',
                                    color: 'var(--color)',
                                    cursor: 'pointer'
                                }}
                            >
                                {mode === 'darkmode' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            </button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '40px', backgroundColor: 'var(--btn-background-color)', padding: '20px', borderRadius: '10px' }}>
                        <h3 style={{ marginBottom: '15px', color: 'var(--gradient-color)' }}>Account Information</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div><strong>Name:</strong> {user?.name}</div>
                            <div><strong>Email:</strong> {user?.email}</div>
                            <div style={{ textTransform: 'capitalize' }}><strong>Role:</strong> {user?.role}</div>
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--btn-background-color)', padding: '20px', borderRadius: '10px' }}>
                        <h3 style={{ marginBottom: '15px', color: '#ff4d4d' }}>Security</h3>
                        <div>
                            <button 
                                onClick={logout}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    border: 'none',
                                    backgroundColor: '#ff4d4d',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
