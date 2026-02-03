import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Calendar, Info, Clapperboard, Heart } from 'lucide-react';
import axios from 'axios';

const MovieCard = ({ movie, index, onShowDetails }) => {
    const [posterUrl, setPosterUrl] = useState(null);
    const { title, overview, vote_average, popularity } = movie;

    // Simple attempt to get poster from TMDB without a key (using search)
    // Note: Usually you need a key, but for demo we can use a placeholder or 
    // try to find if the user has a path.
    useEffect(() => {
        const fetchPoster = async () => {
            const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
            try {
                // Fetch movie details from TMDB
                const response = await axios.get(
                    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
                );

                if (response.data.results && response.data.results.length > 0) {
                    const posterPath = response.data.results[0].poster_path;
                    if (posterPath) {
                        setPosterUrl(`https://image.tmdb.org/t/p/w500${posterPath}`);
                    } else {
                        // Fallback if no poster path
                        setPosterUrl(`https://loremflickr.com/800/1200/movie,poster,${encodeURIComponent(title)}`);
                    }
                } else {
                    // Fallback if no movie found
                    setPosterUrl(`https://loremflickr.com/800/1200/movie,poster,${encodeURIComponent(title)}`);
                }
            } catch (err) {
                console.error('TMDB fetch error:', err);
                setPosterUrl(`https://loremflickr.com/800/1200/movie,poster,${encodeURIComponent(title)}`);
            }
        };
        fetchPoster();
    }, [title]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 80
            }}
            className="group relative bg-gray-950 rounded-[2.5rem] overflow-hidden aspect-[10/15] border border-white/5 hover:border-indigo-500/50 transition-all duration-700 shadow-2xl hover:shadow-indigo-500/20"
        >
            {/* Dynamic Glow Layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-rose-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            {/* Image / Poster Area */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src={posterUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:blur-[2px]"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
            </div>

            {/* Floating Badges */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="bg-black/40 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-2xl flex items-center gap-2"
                >
                    <Star className="text-yellow-400" size={14} fill="currentColor" />
                    <span className="text-xs font-black text-white">{vote_average?.toFixed(1) || '7.5'}</span>
                </motion.div>
                <button className="w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center hover:bg-rose-500 transition-colors group/heart">
                    <Heart size={18} className="text-white group-hover/heart:fill-current" />
                </button>
            </div>

            {/* Interactive Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
                <div className="translate-y-12 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                    <h3 className="text-white font-[900] text-2xl mb-2 tracking-tighter leading-none uppercase italic group-hover:text-indigo-400 transition-colors">
                        {title}
                    </h3>

                    <p className="text-gray-400 text-xs font-medium mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                        {overview}
                    </p>

                    <div className="flex gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                        <button
                            onClick={() => onShowDetails(movie)}
                            className="flex-1 bg-white text-black text-[11px] font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl"
                        >
                            <Info size={14} />
                            DESCRIPTION
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress Bar (Visual decorative) */}
            <div className="absolute bottom-0 left-0 h-1 bg-indigo-600 w-0 group-hover:w-full transition-all duration-700" />
        </motion.div>
    );
};

export default MovieCard;
