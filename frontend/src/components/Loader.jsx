import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
            >
                <div className="text-6xl mb-4">🎬</div>
                <h1 className="text-4xl font-bold text-white tracking-tighter">
                    MOVIE<span className="text-indigo-600">MIND</span>
                </h1>
                <motion.div
                    className="mt-8 h-1 w-48 bg-gray-800 rounded-full overflow-hidden"
                >
                    <motion.div
                        className="h-full bg-indigo-600"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                </motion.div>
                <p className="mt-4 text-gray-500 animate-pulse text-sm uppercase tracking-widest">
                    Curating your experience...
                </p>
            </motion.div>
        </div>
    );
};

export default Loader;
