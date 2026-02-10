import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Calendar, Info, Clapperboard, Heart } from 'lucide-react';
import axios from 'axios';

const MovieCard = ({ movie, index, onShowDetails, isLiked, onToggleLike }) => {
    const [posterUrl, setPosterUrl] = useState(null);
    const { title, overview, vote_average } = movie;

    useEffect(() => {
        const fetchPoster = async () => {
            const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
                );

                if (response.data.results && response.data.results.length > 0) {
                    const posterPath = response.data.results[0].poster_path;
                    if (posterPath) {
                        setPosterUrl(`https://image.tmdb.org/t/p/w500${posterPath}`);
                    } else {
                        setPosterUrl(`https://loremflickr.com/800/1200/movie,poster,${encodeURIComponent(title)}`);
                    }
                } else {
                    setPosterUrl(`https://loremflickr.com/800/1200/movie,poster,${encodeURIComponent(title)}`);
                }
            } catch (err) {
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
                delay: index * 0.05,
                type: "spring",
                stiffness: 80
            }}
            className="group relative bg-gray-950 rounded-xl sm:rounded-[2.5rem] overflow-hidden aspect-[10/15] border border-white/5 hover:border-indigo-500/50 transition-all duration-700 shadow-2xl hover:shadow-indigo-500/20"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-rose-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

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

            <div className="absolute top-2 right-2 sm:top-6 sm:right-6 flex flex-col gap-2 z-10">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike(movie);
                    }}
                    className={`w-8 h-8 sm:w-10 sm:h-10 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center transition-all group/heart ${isLiked ? 'bg-rose-500 border-rose-500' : 'bg-white/10 hover:bg-rose-500/50'}`}
                >
                    <Heart size={16} className={`text-white transition-colors ${isLiked ? 'fill-current' : 'group-hover/heart:fill-current'}`} />
                </button>
            </div>

            <div className="absolute top-2 left-2 sm:top-6 sm:left-6 z-10">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-2 sm:px-3 py-1 rounded-lg sm:rounded-2xl flex items-center gap-1 sm:gap-2">
                    <Star className="text-yellow-400" size={12} fill="currentColor" />
                    <span className="text-[10px] sm:text-xs font-black text-white">{vote_average?.toFixed(1) || '7.5'}</span>
                </div>
            </div>

            <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-8 z-20">
                <div className="translate-y-8 sm:translate-y-12 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                    <h3 className="text-white font-[900] text-sm sm:text-2xl mb-1 sm:mb-2 tracking-tighter leading-none uppercase italic group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {title}
                    </h3>

                    <p className="text-gray-400 text-[10px] sm:text-xs font-medium mb-3 sm:mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 hidden sm:block">
                        {overview}
                    </p>

                    <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-4 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                        <button
                            onClick={() => onShowDetails(movie)}
                            className="flex-1 bg-white text-black text-[8px] sm:text-[11px] font-black py-2 sm:py-4 rounded-lg sm:rounded-2xl flex items-center justify-center gap-1 sm:gap-2 hover:bg-indigo-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl"
                        >
                            <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                            INFO
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 h-1 bg-indigo-600 w-0 group-hover:w-full transition-all duration-700" />
        </motion.div>
    );
};

export default MovieCard;
