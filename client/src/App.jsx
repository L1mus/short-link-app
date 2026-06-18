import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from './redux/slices/authSlice.js';

// Pages
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CreateLinkPage from './pages/CreateLinkPage.jsx';
import Profile from './pages/Profile.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

/**
 * ProtectedRoute — redirect to /login if not login
 */
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/**
 * PublicRoute — redirect ke /dashboard if login
 */
const PublicRoute = ({ children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route
                    path="/"
                    element={
                        <PublicRoute>
                            <LandingPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />

                {/* Protected routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/create-link"
                    element={
                        <ProtectedRoute>
                            <CreateLinkPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                {/* Root redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
