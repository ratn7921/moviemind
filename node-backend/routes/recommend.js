const express = require('express');
const router = express.Router();
const axios = require('axios');

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://127.0.0.1:8000';

router.get('/recommend', async (req, res) => {
    try {
        const { movie } = req.query;
        if (!movie) return res.status(400).json({ message: 'Movie parameter is required' });

        const redis = req.app.get('redis');
        const isRedisEnabled = req.app.get('redisEnabled')();

        // Try searching in Redis Cache first if enabled
        const cacheKey = `recommend:${movie.toLowerCase()}`;
        let cachedData = null;

        if (isRedisEnabled && redis) {
            try {
                cachedData = await redis.get(cacheKey);
            } catch (e) {
                console.log('Redis get error:', e.message);
            }
        }

        if (cachedData) {
            console.log('Serving from Redis Cache');
            return res.json(JSON.parse(cachedData));
        }

        // If not in cache, fetch from FastAPI
        console.log('Fetching from FastAPI AI Backend');
        const response = await axios.get(`${FASTAPI_URL}/recommend?movie=${movie}`);

        // Save to Redis Cache if enabled
        if (isRedisEnabled && redis) {
            try {
                await redis.set(cacheKey, JSON.stringify(response.data), 'EX', 3600);
            } catch (e) {
                console.log('Redis set error:', e.message);
            }
        }

        res.json(response.data);
    } catch (err) {
        console.error('Proxy Error:', err.message);
        res.status(500).json({ message: 'Error fetching recommendations' });
    }
});

module.exports = router;
