export const API_URL = import.meta.env.VITE_API_URL || '';

export const getApiUrl = (endpoint) => {
    // Ensure endpoint starts with a slash
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_URL}${path}`;
};
