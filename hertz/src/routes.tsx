import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import LandingPage from './components/LandingPage';
import HomePage from './components/HomePage';

const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/home" element={<HomePage />} />

            </Routes>
        </Router>
    );
};

export default AppRoutes;

