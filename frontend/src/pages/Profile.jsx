import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Heart, History, LogOut, ChevronLeft, Trash2, Shield, Star, Info, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';

const Profile = ({ user, setLogout }) => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const avatars = [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria'
    ];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfileData(res.data);
        } catch (err) {
            console.error('Failed to fetch profile', err);
        } finally {
            setLoading(false);
        }
    };

    const updateAvatar = async (avatarUrl) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/user/profile/avatar`,
                { avatar: avatarUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setProfileData({ ...profileData, avatar: avatarUrl });
        } catch (err) {
            console.error('Failed to update avatar', err);
        }
    };

    const clearHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/user/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfileData({ ...profileData, searchHistory: [] });
        } catch (err) {
            console.error('Failed to clear history', err);
        }
    };

    const toggleLike = async (movie) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/like`,
                { movie },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setProfileData({ ...profileData, likedMovies: res.data });
        } catch (err) {
            console.error('Failed to toggle like', err);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const defaultAvatar = `https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff&size=256`;

    return (
        <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden font-['Inter']">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
                <nav className="max-w-7xl mx-auto h-16 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl px-6 flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ChevronLeft size={20} />
                        <span className="text-xs font-black uppercase tracking-widest">Back to Discover</span>
                    </button>
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-[900] tracking-tighter uppercase italic">
                            PRO<span className="text-indigo-500">FILE</span>
                        </h1>
                    </div>
                    <button onClick={setLogout} className="p-2 bg-white/5 hover:bg-rose-500/20 border border-white/10 rounded-xl transition-all">
                        <LogOut size={18} className="text-gray-400 hover:text-rose-500" />
                    </button>
                </nav>
            </header>

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                {/* Profile Info Card */}
                <section className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 sm:p-12 mb-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <User size={200} />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-10">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                            <img
                                src={profileData?.avatar || defaultAvatar}
                                alt="avatar"
                                className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-black object-cover"
                            />
                        </div>

                        <div className="text-center sm:text-left">
                            <h2 className="text-4xl sm:text-6xl font-[900] tracking-tighter uppercase mb-4">{profileData?.username}</h2>
                            <p className="text-gray-500 font-bold tracking-widest text-xs uppercase mb-8">{profileData?.email}</p>

                            <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                                <button className="cursor-default bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase">
                                    Member since {new Date(profileData?.createdAt).getFullYear()}
                                </button>
                                <div className="flex gap-2">
                                    {avatars.map((url, i) => (
                                        <button
                                            key={i}
                                            onClick={() => updateAvatar(url)}
                                            className={`w-8 h-8 rounded-full border-2 transition-all overflow-hidden ${profileData?.avatar === url ? 'border-indigo-500 scale-110' : 'border-white/10 hover:border-white/30'}`}
                                        >
                                            <img src={url} alt="avatar option" />
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => updateAvatar('')}
                                        className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center text-[8px] font-black ${!profileData?.avatar ? 'border-indigo-500 scale-110 bg-indigo-500 text-white' : 'border-white/10 bg-white/5 text-gray-400'}`}
                                    >
                                        DEF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Liked Movies */}
                <section className="mb-20">
                    <div className="flex items-center gap-4 mb-10">
                        <Heart className="text-rose-500 fill-current" size={24} />
                        <h3 className="text-3xl font-[900] tracking-tighter uppercase italic">Your Liked Classics</h3>
                        <div className="flex-1 h-px bg-white/5"></div>
                        <span className="text-xs font-black text-gray-600 uppercase tracking-widest">{profileData?.likedMovies?.length || 0} ITEMS</span>
                    </div>

                    {profileData?.likedMovies?.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-10">
                            {profileData.likedMovies.map((movie, i) => (
                                <MovieCard
                                    key={movie.id}
                                    movie={movie}
                                    index={i}
                                    onShowDetails={setSelectedMovie}
                                    isLiked={true}
                                    onToggleLike={toggleLike}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
                            <Heart className="mx-auto text-white/5 mb-6" size={60} />
                            <p className="text-gray-600 font-bold uppercase tracking-widest">No liked movies yet</p>
                        </div>
                    )}
                </section>

                {/* Search History */}
                <section>
                    <div className="flex items-center gap-4 mb-10">
                        <History className="text-indigo-500" size={24} />
                        <h3 className="text-3xl font-[900] tracking-tighter uppercase italic">Memory Archive</h3>
                        <div className="flex-1 h-px bg-white/5"></div>
                        <button
                            onClick={clearHistory}
                            className="flex items-center gap-2 text-[10px] font-black text-gray-600 hover:text-rose-500 transition-colors uppercase tracking-widest outline-none"
                        >
                            <Trash2 size={14} />
                            Clear History
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profileData?.searchHistory?.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between group hover:bg-white/[0.08] transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                                        <History size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{item.query}</h4>
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-tighter">
                                            {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/', { state: { query: item.query } })}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest"
                                >
                                    Relaunch
                                </button>
                            </motion.div>
                        ))}
                        {profileData?.searchHistory?.length === 0 && (
                            <div className="col-span-full text-center py-10 text-gray-600 font-bold uppercase tracking-widest">
                                No recently logged activity
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Modal for details (sharing common component logic) */}
            <AnimatePresence>
                {selectedMovie && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedMovie(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
                        >
                            <div className="p-12">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-12 bg-indigo-600 rounded-full" />
                                        <h2 className="text-4xl font-[900] uppercase italic tracking-tighter leading-none">
                                            {selectedMovie.title}
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => setSelectedMovie(null)}
                                        className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all"
                                    >
                                        <XCircle size={24} className="text-gray-500" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-xl text-xs font-black">
                                        <Star size={14} fill="currentColor" />
                                        {selectedMovie.vote_average?.toFixed(1) || 'N/A'}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-xs font-black text-indigo-500 tracking-[0.3em] uppercase">Intelligence Overview</h4>
                                    <p className="text-gray-400 text-lg leading-relaxed font-medium italic">
                                        "{selectedMovie.overview}"
                                    </p>
                                </div>

                                <button
                                    onClick={() => setSelectedMovie(null)}
                                    className="mt-12 w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl"
                                >
                                    CLOSE DATA ARCHIVE
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
