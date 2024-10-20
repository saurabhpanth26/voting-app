const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const app = express();
const port = 3001;

// Redis Client
const client = redis.createClient({
    host: 'redis',
    port: 6379
});

client.on('error', (err) => {
    console.error('Redis error: ', err);
});

app.use(bodyParser.json());

// Create a new topic
app.post('/create_topic', (req, res) => {
    const { title, description } = req.body;
    const id = Date.now(); // Unique ID based on timestamp

    const newTopic = {
        id,
        title,
        description,
        votes: 0
    };

    // Store the topic in Redis
    client.hset('topics', id, JSON.stringify(newTopic), (err, reply) => {
        if (err) return res.status(500).json({ message: 'Error creating topic' });
        res.status(201).json({ message: 'Topic created successfully', topic: newTopic });
    });
});

// Get all topics
app.get('/topics', (req, res) => {
    client.hgetall('topics', (err, topics) => {
        if (err) return res.status(500).json({ message: 'Error fetching topics' });
        const parsedTopics = Object.keys(topics).map(key => JSON.parse(topics[key]));
        res.status(200).json(parsedTopics);
    });
});

app.listen(port, () => {
    console.log(`Create Topic service running on port ${port}`);
});
