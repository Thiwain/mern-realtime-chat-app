import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const authContext = useContext(AuthContext);

    if (!authContext?.isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
