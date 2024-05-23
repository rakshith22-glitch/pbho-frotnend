// frontend/src/contexts/UserContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create UserContext
export const UserContext = createContext();

// Create UserProvider
export const UserProvider = ({ children, navigate }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user data from API or localStorage
        const fetchUser = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user')) || null;
                setUser(userData);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUser();
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use UserContext
export const useUser = () => {
    return useContext(UserContext);
};
