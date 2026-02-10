const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update profile avatar
router.patch('/profile/avatar', auth, async (req, res) => {
    try {
        const { avatar } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { avatar }, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Like a movie
router.post('/like', auth, async (req, res) => {
    try {
        const { movie } = req.body;
        const user = await User.findById(req.user.id);

        // Check if already liked
        const exists = user.likedMovies.find(m => m.id === movie.id);
        if (exists) {
            user.likedMovies = user.likedMovies.filter(m => m.id !== movie.id);
        } else {
            user.likedMovies.push(movie);
        }

        await user.save();
        res.json(user.likedMovies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add to search history
router.post('/history', auth, async (req, res) => {
    try {
        const { query } = req.body;
        const user = await User.findById(req.user.id);

        // Remove existing if duplicate to move to top
        user.searchHistory = user.searchHistory.filter(h => h.query.toLowerCase() !== query.toLowerCase());

        user.searchHistory.unshift({ query, timestamp: new Date() });

        // Limit history to top 20
        if (user.searchHistory.length > 20) {
            user.searchHistory.pop();
        }

        await user.save();
        res.json(user.searchHistory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Clear history
router.delete('/history', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.searchHistory = [];
        await user.save();
        res.json({ message: 'History cleared' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
