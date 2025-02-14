import React, { useState, createContext, useContext, ReactNode,useEffect } from 'react';

// Define the type for the context value
interface UserContextType {
    username: string | null;
    setUsername: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create the UserContext
const UserContext = createContext<UserContextType | undefined>(undefined);

// UserProvider component that wraps your application and provides the context
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        if (username) {
            localStorage.setItem('username', username);
        } else {
            // localStorage.removeItem('username'); // Optionally remove username from localStorage on logout
        }
    }, [username]);

    return (
        <UserContext.Provider value={{ username, setUsername }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
