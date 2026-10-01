import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Seperation from '../components/seperation/Seperation';
import { getApiUrl } from '../config/api';

function Admin() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(getApiUrl('/api/admin/users'), { 
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Unauthorized");
                return res.json();
            })
            .then(data => setUsers(data))
            .catch(err => setError(err.message));
    }, []);

    return (
        <div className="chatbot-container">
            <Sidebar />
            <Seperation />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '50px', backgroundColor: 'var(--background-color)', color: 'var(--color)', minHeight: '100vh', width: '100%', overflowY: 'auto' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                    <h2 style={{ marginBottom: '20px' }}>Admin Dashboard - Registered Users</h2>
                    {error ? (
                        <p style={{ color: 'red' }}>Error: {error}</p>
                    ) : users.length > 0 ? (
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                            <thead>
                                <tr style={{ backgroundColor: 'var(--btn-background-color)', textAlign: 'left' }}>
                                    <th style={{ padding: '12px', borderBottom: '1px solid #333' }}>Name</th>
                                    <th style={{ padding: '12px', borderBottom: '1px solid #333' }}>Email</th>
                                    <th style={{ padding: '12px', borderBottom: '1px solid #333' }}>Role</th>
                                    <th style={{ padding: '12px', borderBottom: '1px solid #333' }}>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id} style={{ borderBottom: '1px solid #333' }}>
                                        <td style={{ padding: '12px' }}>{u.name}</td>
                                        <td style={{ padding: '12px' }}>{u.email}</td>
                                        <td style={{ padding: '12px', textTransform: 'capitalize' }}>{u.role}</td>
                                        <td style={{ padding: '12px' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Loading users...</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Admin;
