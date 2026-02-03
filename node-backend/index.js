const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const Redis = require('ioredis');
const authRoutes = require('./routes/auth');
const recommendRoutes = require('./routes/recommend');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Redis Setup for caching with fallback
let redis;
let redisEnabled = false;

try {
    redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
        maxRetriesPerRequest: 1,
        retryStrategy: () => false // Don't keep retrying if it fails
    });

    redis.on('error', (err) => {
        if (!redisEnabled) return; // Ignore first error if it never connected
        console.log('Redis connection lost. Caching disabled.');
        redisEnabled = false;
    });

    redis.on('connect', () => {
        console.log('Redis connected (Caching Enabled)');
        redisEnabled = true;
    });
} catch (e) {
    console.log('Redis Caching Disabled');
}

// Share redis with routes
app.set('redis', redis);
app.set('redisEnabled', () => redisEnabled);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', recommendRoutes);

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/moviemind';
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

app.listen(PORT, () => {
    console.log(`Node.js Backend running on http://localhost:${PORT}`);
});
