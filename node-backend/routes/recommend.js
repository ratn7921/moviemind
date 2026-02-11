const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/recommend', async (req, res) => {
    const FASTAPI_URL = (process.env.FASTAPI_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');
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
        console.log(`Fetching from FastAPI AI Backend at: ${FASTAPI_URL}/recommend?movie=${movie}`);
        const response = await axios.get(`${FASTAPI_URL}/recommend?movie=${movie}`, { timeout: 10000 });

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
        console.error('Proxy Error details:');
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Response status:', err.response.status);
            console.error('Response data:', err.response.data);
        } else if (err.request) {
            // The request was made but no response was received
            console.error('No response received from AI Backend');
            console.error('Request details:', err.config.url);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', err.message);
        }
        res.status(500).json({
            message: 'Error fetching recommendations',
            error: err.message,
            hint: 'Verify the AI Backend is running and reachable.'
        });
    }
});

module.exports = router;
