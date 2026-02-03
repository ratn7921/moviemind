import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, LogOut, Clapperboard, Sparkles, TrendingUp, History, Info, XCircle, Zap, Film, Star } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { motion, AnimatePresence } from 'framer-motion';

const Home = ({ user, setLogout }) => {
    const [query, setQuery] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) setRecentSearches(JSON.parse(saved));
    }, []);

    const handleSearch = async (e, forcedQuery = null) => {
        if (e) e.preventDefault();
        const activeQuery = forcedQuery || query;
        if (!activeQuery.trim()) return;

        setLoading(true);
        setError('');

        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/recommend?movie=${activeQuery}`);
            if (res.data.error) {
                setError(res.data.error);
                setRecommendations([]);
            } else {
                setRecommendations(res.data.recommendations || []);
                const newRecent = [activeQuery, ...recentSearches.filter(s => s !== activeQuery)].slice(0, 5);
                setRecentSearches(newRecent);
                localStorage.setItem('recentSearches', JSON.stringify(newRecent));
            }
        } catch (err) {
            setError('Connection Failure. Please verify the backend is active.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030303] text-white selection:bg-indigo-500/30 overflow-x-hidden font-['Inter']">

            {/* Cinematic Tilted Collage Background */}
            <div className="fixed inset-0 z-0 overflow-hidden">
                <div
                    className="absolute -inset-[10%] opacity-20"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2000&auto=format&fit=crop')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.2) blur(2px)',
                        transform: 'rotate(-10deg) scale(1.1)',
                        animation: 'pan 100s linear infinite alternate'
                    }}
                />
                <style>{`
                    @keyframes pan {
                        0% { background-position: 0% 0%; }
                        100% { background-position: 100% 100%; }
                    }
                `}</style>
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/95 to-transparent" />
                <div
                    className="absolute inset-0"
                    style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(3,3,3,0.8) 100%)' }}
                />
            </div>

            {/* Floating Modern Header */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
                <motion.nav
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    className="max-w-7xl mx-auto h-20 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] px-8 flex items-center justify-between shadow-2xl"
                >
                    <div className="flex items-center gap-4">
                        <motion.div
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.5 }}
                            className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30"
                        >
                            <Film className="text-white" size={24} />
                        </motion.div>
                        <h1 className="text-2xl font-[900] tracking-tighter uppercase italic">
                            MOVIE<span className="text-indigo-500">MIND</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                            <span className="text-xs font-bold text-gray-400">Curating for <span className="text-white">{user?.username}</span></span>
                        </div>
                        <button
                            onClick={setLogout}
                            className="group p-3 bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/50 rounded-2xl transition-all"
                        >
                            <LogOut size={20} className="text-gray-400 group-hover:text-rose-500 transition-colors" />
                        </button>
                    </div>
                </motion.nav>
            </header>

            <main
                className="max-w-7xl mx-auto px-6 pb-20 relative z-10 flex flex-col"
                style={{ minHeight: recommendations.length > 0 ? 'auto' : '100vh', paddingTop: recommendations.length > 0 ? '12rem' : '0' }}
            >

                {/* Animated Hero Section */}
                <section className={`text-center transition-all duration-1000 ${recommendations.length > 0 ? 'mb-12' : 'flex-1 flex flex-col justify-center mb-0'}`}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 px-8 py-3 rounded-full text-[10px] font-black tracking-[0.3em] mb-12 uppercase"
                    >
                        <Zap size={14} className="fill-current" /> Next-Gen Recommendation Engine
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl sm:text-8xl font-[900] mb-12 leading-[0.9] tracking-tighter"
                    >
                        Search   <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 animate-gradient-x">Cinema.</span>
                    </motion.h2>

                    {/* Search Bar with Glass Interaction */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-3xl mx-auto relative group"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[3rem] blur-2xl opacity-10 group-focus-within:opacity-30 transition-opacity duration-700" />
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search a movie you admire..."
                                className="w-full bg-white/5 border-2 border-white/10 rounded-[2.5rem] py-8 pl-20 pr-48 focus:outline-none focus:border-indigo-500 transition-all text-2xl font-bold placeholder:text-gray-700 backdrop-blur-xl shadow-2xl"
                            />
                            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors" size={32} />
                            <button
                                type="submit"
                                disabled={loading}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-800 text-white font-black py-5 px-10 rounded-[1.8rem] transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-3 active:scale-95 disabled:scale-100"
                            >
                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={18} />}
                                {loading ? 'ANALYZING' : 'DISCOVER'}
                            </button>
                        </form>
                    </motion.div>

                    {/* Search History Chips */}
                    <div className="flex flex-wrap justify-center gap-4 mt-12">
                        <AnimatePresence>
                            {recentSearches.map((s, i) => (
                                <motion.button
                                    key={s}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => { setQuery(s); handleSearch(null, s); }}
                                    className="text-[11px] font-black text-gray-400 hover:text-white bg-white/5 hover:bg-indigo-600 border border-white/10 hover:border-indigo-500 px-6 py-2.5 rounded-full transition-all uppercase tracking-widest"
                                >
                                    {s}
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>

                {/* Results Area */}
                <section className="relative">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-rose-500/10 border border-rose-500/20 p-12 rounded-[3.5rem] text-center max-w-2xl mx-auto backdrop-blur-xl"
                            >
                                <XCircle className="text-rose-500 mx-auto mb-6" size={56} />
                                <h4 className="text-3xl font-[900] text-white mb-4 tracking-tight italic">ENCOUNTERED AN ERROR</h4>
                                <p className="text-gray-400 font-medium mb-8 leading-relaxed px-10">{error}</p>
                                <button
                                    onClick={() => setError('')}
                                    className="bg-rose-500 hover:bg-rose-600 text-white font-black px-10 py-4 rounded-2xl transition-all shadow-lg shadow-rose-500/20"
                                >
                                    TRY AGAIN
                                </button>
                            </motion.div>
                        )}

                        {recommendations.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                key="results"
                                className="space-y-16"
                            >
                                <div className="flex items-end justify-between border-b border-white/5 pb-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-1 w-20 bg-indigo-600 rounded-full" />
                                        <h3 className="text-5xl font-[900] uppercase italic tracking-tighter">Matches for You</h3>
                                    </div>
                                    <div className="hidden md:flex flex-col items-end gap-2 text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">
                                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Algorithm v4.2 Active</span>
                                        <span>Confidence: 98.4%</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10 justify-center">
                                    {recommendations.map((movie, i) => (
                                        <MovieCard key={i} movie={movie} index={i} onShowDetails={setSelectedMovie} />
                                    ))}
                                </div>
                            </motion.div>
                        ) : !loading && !error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-40 border-2 border-dashed border-white/5 rounded-[4rem] group"
                            >
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                >
                                    <Film className="mx-auto mb-8 text-white/5 opacity-50 group-hover:text-indigo-500/20 transition-colors" size={100} />
                                </motion.div>
                                <p className="text-4xl font-[900] text-gray-800 italic uppercase">Waiting for Command</p>
                                <p className="text-xs text-gray-500 mt-4 font-black uppercase tracking-[0.5em]">Input movie title to generate similarity matrix</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </main>

            {/* Premium Details Modal */}
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
                                    <div className="text-[10px] text-gray-500 font-black tracking-widest uppercase">
                                        Popularity: {selectedMovie.popularity?.toFixed(0)}
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

                            {/* Decorative bottom accent */}
                            <div className="h-1 w-full bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-30" />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <footer className="mt-40 border-t border-white/5 py-24 relative overflow-hidden bg-white/[0.01]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
                    <div className="flex gap-16 text-gray-600 font-black text-[11px] tracking-[0.4em] mb-12">
                        <span className="hover:text-white cursor-pointer transition-colors">OS ARCHITECTURE</span>
                        <span className="hover:text-white cursor-pointer transition-colors">NEURAL LINK</span>
                        <span className="hover:text-white cursor-pointer transition-colors">like function is coming</span>
                        <span className="hover:text-white cursor-pointer transition-colors">PROTOCOLS</span>
                    </div>
                    <div className="w-px h-20 bg-gradient-to-t from-transparent via-indigo-600/50 to-transparent mb-12" />
                    <p className="text-gray-700 text-[10px] font-bold tracking-widest italic">&copy; 2026 MOVIEMIND CO. EVOLVED CINEMATIC INTELLIGENCE.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
