import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Spinner } from './components/ui/spinner';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // While loading, show a spinner
    if (loading) {
        return <Spinner size="large" />;
    }

    // If the user is not authenticated, redirect to the login page
    if (!isAuthenticated) {
        return <Navigate to="/Login" replace />;
    }

    // Render the protected children if authenticated
    return <>{children}</>;
};

export default ProtectedRoute;