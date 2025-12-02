const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper function to get auth token
const getAuthToken = (): string | null => {
    return localStorage.getItem('token');
};

// Helper function to create headers
const createHeaders = (includeAuth: boolean = false): HeadersInit => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
};

// Auth API
export const authAPI = {
    register: async (email: string, username: string, password: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify({ email, username, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Registration failed');
        }

        return response.json();
    },

    login: async (username: string, password: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/login/json`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Login failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('username', username);
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    },

    isAuthenticated: (): boolean => {
        return !!getAuthToken();
    },

    getUsername: (): string | null => {
        return localStorage.getItem('username');
    },
};

// Prediction API
export const predictionAPI = {
    predictFood: async (imageFile: File) => {
        const formData = new FormData();
        formData.append('image', imageFile);

        const token = getAuthToken();
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/predict/`, {
            method: 'POST',
            headers,
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Prediction failed');
        }

        return response.json();
    },
};

// Food Log API
export const foodLogAPI = {
    addLog: async (logData: any) => {
        const response = await fetch(`${API_BASE_URL}/log/add`, {
            method: 'POST',
            headers: createHeaders(true),
            body: JSON.stringify(logData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to add food log');
        }

        return response.json();
    },

    getHistory: async (limit: number = 50, offset: number = 0) => {
        const response = await fetch(
            `${API_BASE_URL}/log/history?limit=${limit}&offset=${offset}`,
            {
                headers: createHeaders(true),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to fetch history');
        }

        return response.json();
    },

    getTodayLogs: async () => {
        const response = await fetch(`${API_BASE_URL}/log/today`, {
            headers: createHeaders(true),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to fetch today\'s logs');
        }

        return response.json();
    },

    getTodaySummary: async () => {
        const response = await fetch(`${API_BASE_URL}/log/summary/today`, {
            headers: createHeaders(true),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to fetch summary');
        }

        return response.json();
    },

    deleteLog: async (logId: number) => {
        const response = await fetch(`${API_BASE_URL}/log/${logId}`, {
            method: 'DELETE',
            headers: createHeaders(true),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to delete log');
        }
    },
};
