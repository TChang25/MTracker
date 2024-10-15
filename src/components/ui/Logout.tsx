// Logout.tsx
import React from 'react';
import { useAuth } from '../../AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Button } from './button';

const Logout: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout(); // Call the logout function
        navigate('/Login'); // Redirect to login page after logging out
    };

    return (
        <Button onClick={handleLogout}>
            Log Out
        </Button>
    );
};

export default Logout;
