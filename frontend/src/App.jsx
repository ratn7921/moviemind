import React, { useState, useEffect } from 'react';
import Loader from './components/Loader';
import Home from './pages/Home';
import Login from './pages/Login';
import { AnimatePresence } from 'framer-motion';

function App() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check for existing session
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        // Force 1.5s loading time for professional feel
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
        <div className="App h-full">
            <AnimatePresence mode="wait">
                {!user ? (
                    <Login key="login" setLogin={setUser} />
                ) : (
                    <Home key="home" user={user} setLogout={handleLogout} />
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
