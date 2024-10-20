const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const app = express();
const port = 3002;

// Redis Client
const client = redis.createClient({
    host: 'redis',
    port: 6379
});

client.on('error', (err) => {
    console.error('Redis error: ', err);
});

app.use(bodyParser.json());

// Vote on a topic
app.post('/vote', (req, res) => {
    const { topicId } = req.body;

    // Get the topic from Redis
    client.hget('topics', topicId, (err, topicData) => {
        if (err || !topicData) return res.status(404).json({ message: 'Topic not found' });

        const topic = JSON.parse(topicData);
        topic.votes += 1;

        // Update the topic in Redis
        client.hset('topics', topicId, JSON.stringify(topic), (err, reply) => {
            if (err) return res.status(500).json({ message: 'Error updating votes' });
            res.status(200).json({ message: `Voted on topic: ${topic.title}` });
        });
    });
});

app.listen(port, () => {
    console.log(`Voting service running on port ${port}`);
});
