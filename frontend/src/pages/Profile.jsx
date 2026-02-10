import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Heart, History, LogOut, ChevronLeft, Trash2, Star, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard.jsx';

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
            if (!token) {
                setLoading(false);
                return;
            }
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

    const defaultAvatar = `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=6366f1&color=fff&size=256`;

    return (
        <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden font-['Inter']">
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
                <nav className="max-w-7xl mx-auto h-16 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl px-6 flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Back</span>
                    </button>
                    <h1 className="text-xl font-[900] tracking-tighter uppercase italic">
                        PRO<span className="text-indigo-500">FILE</span>
                    </h1>
                    <button onClick={setLogout} className="p-2 bg-white/5 hover:bg-rose-500/20 border border-white/10 rounded-xl transition-all">
                        <LogOut className="w-4 h-4 text-gray-400 hover:text-rose-500" />
                    </button>
                </nav>
            </header>

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <section className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 sm:p-12 mb-16">
                    <div className="flex flex-col sm:row items-center gap-10">
                        <img
                            src={profileData?.avatar || defaultAvatar}
                            alt="avatar"
                            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-black object-cover"
                        />
                        <div className="text-center sm:text-left">
                            <h2 className="text-4xl sm:text-6xl font-[900] tracking-tighter uppercase mb-4">{profileData?.username}</h2>
                            <p className="text-gray-500 font-bold tracking-widest text-xs uppercase mb-8">{profileData?.email}</p>
                            <div className="flex gap-2">
                                {avatars.map((url, i) => (
                                    <button key={i} onClick={() => updateAvatar(url)} className={`w-8 h-8 rounded-full border-2 ${profileData?.avatar === url ? 'border-indigo-500' : 'border-white/10'}`}>
                                        <img src={url} alt="avatar" className="rounded-full" />
                                    </button>
                                ))}
                                <button onClick={() => updateAvatar('')} className="w-8 h-8 rounded-full border-2 bg-white/5 text-[8px] font-black">DEF</button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-20">
                    <div className="flex items-center gap-4 mb-10">
                        <Heart className="text-rose-500 fill-current w-6 h-6" />
                        <h3 className="text-3xl font-[900] tracking-tighter uppercase italic">Liked Classics</h3>
                    </div>
                    {profileData?.likedMovies?.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-10">
                            {profileData.likedMovies.map((movie, i) => (
                                <MovieCard key={movie.id} movie={movie} index={i} onShowDetails={setSelectedMovie} isLiked={true} onToggleLike={toggleLike} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 font-bold uppercase text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">No liked movies yet</p>
                    )}
                </section>

                <section>
                    <div className="flex items-center gap-4 mb-10">
                        <History className="text-indigo-500 w-6 h-6" />
                        <h3 className="text-3xl font-[900] tracking-tighter uppercase italic">Memory Archive</h3>
                        <button onClick={clearHistory} className="ml-auto flex items-center gap-2 text-[10px] font-black text-gray-600 hover:text-rose-500 uppercase">
                            <Trash2 className="w-3 h-3" /> Clear
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profileData?.searchHistory?.map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between group">
                                <div>
                                    <h4 className="font-bold text-lg">{item.query}</h4>
                                    <p className="text-[10px] text-gray-500 uppercase">{new Date(item.timestamp).toLocaleDateString()}</p>
                                </div>
                                <button onClick={() => navigate('/', { state: { query: item.query } })} className="bg-indigo-600 text-white text-[10px] font-black px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 uppercase">Relaunch</button>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <AnimatePresence>
                {selectedMovie && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <div onClick={() => setSelectedMovie(null)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-12">
                            <h2 className="text-4xl font-[900] uppercase italic mb-8">{selectedMovie.title}</h2>
                            <p className="text-gray-400 text-lg italic mb-12">"{selectedMovie.overview}"</p>
                            <button onClick={() => setSelectedMovie(null)} className="w-full bg-white text-black font-black py-5 rounded-2xl">CLOSE</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
