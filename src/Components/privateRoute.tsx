import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';


const PrivateRoute = () => {
    const username = localStorage.getItem('username'); 
    if (!username) {
        console.log("innnn refresh");
        
        return <Navigate to="/" />;
    }
    return <Outlet />;
}

export default PrivateRoute;