const express = require('express');
const redis = require('redis');
const app = express();
const port = 3003;

// Redis Client
const client = redis.createClient({
    host: 'redis',
    port: 6379
});

client.on('error', (err) => {
    console.error('Redis error: ', err);
});

// Get results for all topics
app.get('/results', (req, res) => {
    client.hgetall('topics', (err, topics) => {
        if (err) return res.status(500).json({ message: 'Error fetching results' });

        const parsedTopics = Object.keys(topics).map(key => JSON.parse(topics[key]));
        res.status(200).json(parsedTopics);
    });
});

app.listen(port, () => {
    console.log(`Results service running on port ${port}`);
});
