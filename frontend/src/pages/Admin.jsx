import React, { useEffect, useState } from 'react';

import { getApiUrl } from '../config/api';

function Admin() {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(getApiUrl('/api/admin/dashboard'), { credentials: 'include' })
            .then(res => {
                if (!res.ok) throw new Error("Unauthorized");
                return res.json();
            })
            .then(data => setStats(data))
            .catch(err => setError(err.message));
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '50px', backgroundColor: 'var(--background-color)', color: 'var(--color)', minHeight: '100vh', width: '100%' }}>
            <h2>Admin Dashboard</h2>
            {error ? (
                <p style={{ color: 'red' }}>Error: {error}</p>
            ) : stats ? (
                <div>
                    <p>{stats.message}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Admin;
