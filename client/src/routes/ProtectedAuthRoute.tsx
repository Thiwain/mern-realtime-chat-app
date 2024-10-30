import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface ProtectedAuthRouteProps {
    children: React.ReactNode;
}

const ProtectedAuthRoute: React.FC<ProtectedAuthRouteProps> = ({ children }) => {
    const authContext = useContext(AuthContext);

    if (authContext?.isAuthenticated) {
        return <Navigate to="/home" />;
    }

    return <>{children}</>;
};

export default ProtectedAuthRoute;
