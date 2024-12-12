// AuthContext.js
import React, { createContext, useState, useContext } from "react";

// Create the Context
const AuthContext = createContext();

// Create the AuthProvider component to provide context
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // user state to store logged-in user's data

    const login = (userData) => {
        setUser(userData); // set user data when login
    };

    const logout = () => {
        setUser(null); // clear user data on logout
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
