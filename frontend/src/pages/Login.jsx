import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User as UserIcon, Clapperboard, Sparkles, ShieldCheck } from 'lucide-react';

const Login = ({ setLogin }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setLogin(res.data.user);
        } catch (err) {
            setError(err.response?.data?.message || 'Connection refused. Is the backend server running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 font-['Inter'] relative overflow-hidden">
            {/* Cinematic Tilted Collage Background */}
            <div className="fixed inset-0 z-0 overflow-hidden">
                <div
                    className="absolute -inset-[10%] opacity-30"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2000&auto=format&fit=crop')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'grayscale(0.5) brightness(0.2) blur(1px)',
                        transform: 'rotate(-15deg) scale(1.1)',
                        animation: 'pan-login 120s linear infinite alternate'
                    }}
                />
                <style>{`
                    @keyframes pan-login {
                        0% { background-position: 0% 0%; }
                        100% { background-position: 100% 100%; }
                    }
                `}</style>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
                <div
                    className="absolute inset-0"
                    style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.9) 100%)' }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-[480px] bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[48px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] z-10"
            >
                <div className="p-8 sm:p-12">
                    <div className="flex flex-col items-center mb-10">
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-indigo-600/30 cursor-pointer"
                        >
                            <Clapperboard color="white" size={36} />
                        </motion.div>
                        <h1 className="text-4xl font-[900] text-white tracking-tighter flex items-center gap-1">
                            MOVIE<span className="text-indigo-600">MIND</span>
                        </h1>
                        <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm font-medium">
                            <Sparkles size={14} className="text-indigo-500" />
                            <span>{isRegister ? 'Join the exclusive cinematic world' : 'The cinema is waiting for you'}</span>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-medium flex items-start gap-3 mb-8"
                            >
                                <ShieldCheck size={18} className="shrink-0 mt-0.5" />
                                <p>{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isRegister && (
                            <div className="group">
                                <div className="relative">
                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        className="w-full bg-white/5 border border-gray-800/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-600/50 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        )}
                        <div className="group">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" size={20} />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full bg-white/5 border border-gray-800/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-600/50 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="group">
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" size={20} />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full bg-white/5 border border-gray-800/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-600/50 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 mt-4 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <span>{isRegister ? 'Create Account' : 'Sign In To Reveal'}</span>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-500 text-sm font-medium">
                            {isRegister ? 'Already part of the tribe?' : 'New to MovieMind?'} {' '}
                            <button
                                onClick={() => setIsRegister(!isRegister)}
                                className="text-indigo-500 font-bold hover:text-indigo-400 transition-colors ml-1 underline-offset-4 hover:underline"
                            >
                                {isRegister ? 'Log In' : 'Join Now'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer Accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-20" />
            </motion.div>
        </div>
    );
};

export default Login;
