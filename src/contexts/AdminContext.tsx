import React, { createContext, useContext, useState } from 'react';

// Create a Context for the admin state
const AdminContext = createContext();

// Create a provider component
const AdminProvider = ({ children }) => {
    const [adminState, setAdminState] = useState({});

    // Function to update the admin state
    const updateAdminState = (newState) => {
        setAdminState(prevState => ({ ...prevState, ...newState }));
    };

    return (
        <AdminContext.Provider value={{ adminState, updateAdminState }}>
            {children}
        </AdminContext.Provider>
    );
};

// Custom hook to use the AdminContext
const useAdmin = () => {
    return useContext(AdminContext);
};

export { AdminProvider, useAdmin };