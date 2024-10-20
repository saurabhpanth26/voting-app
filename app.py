from flask import Flask, request, jsonify, render_template
import redis
import os

app = Flask(__name__)

# Configure Redis connection
redis_host = os.getenv('REDIS_HOST', 'localhost')
redis_port = os.getenv('REDIS_PORT', 6379)
r = redis.StrictRedis(host=redis_host, port=redis_port, decode_responses=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/vote', methods=['POST'])
def vote():
    vote = request.json.get('vote')
    
    if vote not in ['option1', 'option2']:
        return jsonify({"error": "Invalid vote. Must be 'option1' or 'option2'"}), 400
    
    r.incr(vote)
    
    return jsonify({"message": "Vote successfully recorded!"}), 200

@app.route('/results', methods=['GET'])
def results():
    option1_votes = r.get('option1') or 0
    option2_votes = r.get('option2') or 0
    
    return jsonify({
        'option1': int(option1_votes),
        'option2': int(option2_votes)
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
