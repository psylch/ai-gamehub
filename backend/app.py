from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///claude_games.db'
db = SQLAlchemy(app)
CORS(app)  # 添加这一行来启用CORS

class ClaudeGame(db.Model):
    id = db.Column(db.String, primary_key=True)
    user_id = db.Column(db.String, nullable=False)
    create_time = db.Column(db.DateTime, nullable=False)
    game_title = db.Column(db.String, nullable=False)
    game_code_content = db.Column(db.Text, nullable=False)
    code_type = db.Column(db.String, nullable=False)
    game_status = db.Column(db.String, nullable=False)

    def __init__(self, user_id, game_title, game_code_content, code_type, game_status):
        self.id = str(uuid.uuid4())
        self.user_id = user_id
        self.create_time = datetime.utcnow()
        self.game_title = game_title
        self.game_code_content = game_code_content
        self.code_type = code_type
        self.game_status = game_status

@app.route('/store', methods=['POST'])
def store_game_data():
    data = request.json
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    
    user_id = data.get('user_id')
    game_title = data.get('game_title')
    game_code_content = data.get('game_code_content')
    code_type = data.get('code_type', 'unknown')
    game_status = data.get('game_status', 'unknown')

    if not user_id or not game_title or not game_code_content:
        return jsonify({'message': 'Missing data'}), 400
    
    new_game = ClaudeGame(user_id, game_title, game_code_content, code_type, game_status)
    db.session.add(new_game)
    db.session.commit()

    return jsonify({'message': 'Data stored successfully', 'game_id': new_game.id}), 201

@app.route('/games', methods=['GET'])
def get_games():
    games = ClaudeGame.query.all()
    games_list = [{
        'id': game.id,
        'user_id': game.user_id,
        'create_time': game.create_time.isoformat(),
        'game_title': game.game_title,
        'code_type': game.code_type,
        'game_status': game.game_status
    } for game in games]
    return jsonify(games_list), 200

@app.route('/games/<game_id>', methods=['GET'])
def get_game(game_id):
    game = ClaudeGame.query.get(game_id)
    if not game:
        return jsonify({'message': 'Game not found'}), 404

    game_data = {
        'id': game.id,
        'user_id': game.user_id,
        'create_time': game.create_time.isoformat(),
        'game_title': game.game_title,
        'game_code_content': game.game_code_content,
        'code_type': game.code_type,
        'game_status': game.game_status
    }
    return jsonify(game_data), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)

