import React, { useState, useEffect } from 'react';
import Loader from './components/Loader';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    if (loading) return <Loader />;

    return (
        <Router>
            <div className="App h-full">
                <AnimatePresence mode="wait">
                    <Routes>
                        {!user ? (
                            <Route path="*" element={<Login setLogin={setUser} />} />
                        ) : (
                            <>
                                <Route path="/" element={<Home user={user} setLogout={handleLogout} />} />
                                <Route path="/profile" element={<Profile user={user} setLogout={handleLogout} />} />
                                <Route path="*" element={<Navigate to="/" />} />
                            </>
                        )}
                    </Routes>
                </AnimatePresence>
            </div>
        </Router>
    );
}

export default App;
