import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, LogOut, Sparkles, XCircle, Zap, Film, Star, User } from 'lucide-react';
import MovieCard from '../components/MovieCard.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const Home = ({ user, setLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [query, setQuery] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [likedMovies, setLikedMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        fetchLikedMovies();
        if (location.state?.query) {
            setQuery(location.state.query);
            handleSearch(null, location.state.query);
        }
    }, [location.state]);

    const fetchLikedMovies = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLikedMovies(res.data.likedMovies || []);
        } catch (err) {
            console.error('Failed to fetch profile', err);
        }
    };

    const handleSearch = async (e, forcedQuery = null) => {
        if (e) e.preventDefault();
        const activeQuery = forcedQuery || query;
        if (!activeQuery.trim()) return;

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/recommend?movie=${activeQuery}`);

            if (res.data.error) {
                setError(res.data.error);
                setRecommendations([]);
            } else {
                setRecommendations(res.data.recommendations || []);
                if (token) {
                    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/history`,
                        { query: activeQuery },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                }
            }
        } catch (err) {
            setError('Connection Failure. Please verify the backend is active.');
        } finally {
            setLoading(false);
        }
    };

    const toggleLike = async (movie) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/like`,
                { movie },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setLikedMovies(res.data);
        } catch (err) {
            console.error('Failed to toggle like', err);
        }
    };

    return (
        <div className="min-h-screen bg-[#030303] text-white selection:bg-indigo-500/30 overflow-x-hidden font-['Inter']">

            {/* Cinematic background */}
            <div className="fixed inset-0 z-0 overflow-hidden">
                <div
                    className="absolute -inset-[10%] opacity-20"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2000&auto=format&fit=crop')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.2) blur(2px)',
                        transform: 'rotate(-10deg) scale(1.1)'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/95 to-transparent" />
            </div>

            <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 sm:py-6">
                <motion.nav
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    className="max-w-7xl mx-auto h-16 sm:h-20 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-[2rem] px-4 sm:px-8 flex items-center justify-between shadow-2xl"
                >
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-indigo-600 rounded-lg sm:rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                            <Film className="text-white w-4 h-4 sm:w-6 sm:h-6" />
                        </div>
                        <h1 className="text-sm sm:text-2xl font-[900] tracking-tighter uppercase italic">
                            MOVIE<span className="text-indigo-500">MIND</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-6">
                        <button
                            onClick={() => navigate('/profile')}
                            className="group flex items-center gap-2 sm:gap-3 bg-white/5 border border-white/10 px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl hover:bg-white/10 transition-all overflow-hidden"
                        >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/10 overflow-hidden flex-shrink-0">
                                <img
                                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=6366f1&color=fff&size=256`}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="hidden sm:block text-xs font-bold text-gray-400">Profile <span className="text-white">{user?.username}</span></span>
                        </button>
                        <button
                            onClick={setLogout}
                            className="group p-2 sm:p-3 bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/50 rounded-xl sm:rounded-2xl transition-all"
                        >
                            <LogOut className="text-gray-400 group-hover:text-rose-500 transition-colors w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </motion.nav>
            </header>

            <main
                className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 relative z-10 flex flex-col"
                style={{ minHeight: recommendations.length > 0 ? 'auto' : '100vh', paddingTop: recommendations.length > 0 ? '8rem' : '0' }}
            >
                <section className={`text-center transition-all duration-1000 ${recommendations.length > 0 ? 'mb-8 sm:mb-12' : 'flex-1 flex flex-col justify-center mb-0'}`}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 px-4 sm:px-8 py-2 sm:py-3 rounded-full text-[8px] sm:text-[10px] font-black tracking-[0.3em] mb-4 sm:mb-12 uppercase"
                    >
                        <Zap className="w-3 h-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" /> Next-Gen Recommendation Engine
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-8xl font-[900] mb-6 sm:mb-12 leading-[0.9] tracking-tighter"
                    >
                        Search   <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500">Cinema.</span>
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-3xl mx-auto relative group"
                    >
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search a movie..."
                                className="w-full bg-white/5 border-2 border-white/10 rounded-[1.5rem] sm:rounded-[2.5rem] py-4 sm:py-8 pl-12 sm:pl-20 pr-32 sm:pr-48 focus:outline-none focus:border-indigo-500 transition-all text-lg sm:text-2xl font-bold placeholder:text-gray-700 backdrop-blur-xl shadow-2xl"
                            />
                            <Search className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors w-6 h-6 sm:w-8 sm:h-8" />
                            <button
                                type="submit"
                                disabled={loading}
                                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-800 text-white font-black py-2 sm:py-5 px-4 sm:px-10 rounded-xl sm:rounded-[1.8rem] transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-2 sm:gap-3"
                            >
                                {loading ? <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />}
                                <span className="text-[10px] sm:text-sm">{loading ? 'ANALYZING' : 'DISCOVER'}</span>
                            </button>
                        </form>
                    </motion.div>
                </section>

                <section className="relative">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-rose-500/10 border border-rose-500/20 p-8 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] text-center max-w-2xl mx-auto"
                            >
                                <XCircle className="text-rose-500 mx-auto mb-4 sm:mb-6 w-10 h-10 sm:w-14 sm:h-14" />
                                <h4 className="text-xl sm:text-3xl font-[900] text-white mb-2 sm:mb-4 tracking-tight italic uppercase">ERROR DETECTED</h4>
                                <p className="text-gray-400 text-xs sm:text-sm mb-6 sm:mb-8">{error}</p>
                                <button
                                    onClick={() => setError('')}
                                    className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-black px-6 sm:px-10 py-3 sm:py-4 rounded-xl transition-all"
                                >
                                    BACK TO MISSION
                                </button>
                            </motion.div>
                        )}

                        {recommendations.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                key="results"
                                className="space-y-8 sm:space-y-16"
                            >
                                <div className="flex items-end justify-between border-b border-white/5 pb-6 sm:pb-10">
                                    <div className="flex items-center gap-4 sm:gap-6">
                                        <div className="hidden sm:block w-16 h-1 bg-indigo-600 rounded-full" />
                                        <h3 className="text-2xl sm:text-5xl font-[900] uppercase italic tracking-tighter">Matches for You</h3>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-10 justify-center">
                                    {recommendations.map((movie, i) => (
                                        <MovieCard
                                            key={i}
                                            movie={movie}
                                            index={i}
                                            onShowDetails={setSelectedMovie}
                                            isLiked={likedMovies.some(m => m.id === movie.id)}
                                            onToggleLike={toggleLike}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        ) : !loading && !error && (
                            <div className="text-center py-20 sm:py-40 border-2 border-dashed border-white/5 rounded-[2rem] sm:rounded-[4rem]">
                                <Film className="mx-auto mb-4 sm:mb-8 text-white/5 w-16 h-16 sm:w-24 sm:h-24" />
                                <p className="text-xl sm:text-4xl font-[900] text-gray-800 italic uppercase">System Standby</p>
                            </div>
                        )}
                    </AnimatePresence>
                </section>
            </main>

            <AnimatePresence>
                {selectedMovie && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
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
                            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 sm:p-12">
                                <div className="flex justify-between items-start mb-6 sm:mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-1.5 sm:w-2 h-8 sm:h-12 bg-indigo-600 rounded-full" />
                                        <h2 className="text-2xl sm:text-4xl font-[900] uppercase italic tracking-tighter leading-none pr-4">
                                            {selectedMovie.title}
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => setSelectedMovie(null)}
                                        className="p-2 sm:p-3 bg-white/5 hover:bg-white/10 rounded-xl sm:rounded-2xl transition-all"
                                    >
                                        <XCircle className="text-gray-500 w-5 h-5 sm:w-6 sm:h-6" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 mb-6 sm:mb-8">
                                    <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-3 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black">
                                        <Star fill="currentColor" className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        {selectedMovie.vote_average?.toFixed(1) || 'N/A'}
                                    </div>
                                    <button
                                        onClick={() => toggleLike(selectedMovie)}
                                        className={`flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all ${likedMovies.some(m => m.id === selectedMovie.id) ? 'bg-rose-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-rose-500/20 hover:text-rose-500'}`}
                                    >
                                        <Star fill={likedMovies.some(m => m.id === selectedMovie.id) ? "currentColor" : "none"} className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        {likedMovies.some(m => m.id === selectedMovie.id) ? 'LIKED' : 'LIKE'}
                                    </button>
                                </div>

                                <div className="space-y-4 sm:space-y-6">
                                    <p className="text-gray-400 text-sm sm:text-lg leading-relaxed font-medium italic">
                                        "{selectedMovie.overview}"
                                    </p>
                                </div>

                                <button
                                    onClick={() => setSelectedMovie(null)}
                                    className="mt-8 sm:mt-12 w-full bg-white text-black font-black py-4 sm:py-5 rounded-xl sm:rounded-2xl hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl text-xs sm:text-base"
                                >
                                    ACKNOWLEDGE
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <footer className="mt-20 sm:mt-40 border-t border-white/5 py-12 sm:py-24 relative overflow-hidden bg-white/[0.01]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
                    <p className="text-gray-700 text-[8px] sm:text-[10px] font-bold tracking-widest italic text-center uppercase">&copy; 2026 MOVIEMIND ARCHIVE. ALL COGNITIVE RIGHTS RESERVED.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
