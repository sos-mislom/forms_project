import secrets
import uuid
from datetime import datetime

from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt

from flask_jwt_extended import (
    JWTManager, jwt_required, get_jwt_identity, create_access_token
)
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://example.com"]}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'supersecretkey'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=True)
    is_admin = db.Column(db.Boolean, default=False)

class Test(db.Model):
    id = db.Column(db.String(16), primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    json_data = db.Column(db.Text, nullable=False)
    is_published = db.Column(db.Boolean, default=False)
    unique_link = db.Column(db.String(36), unique=True, nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    creator = db.relationship('User', backref=db.backref('created_tests', lazy=True))

class TestAnswer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    test_id = db.Column(db.String(16), db.ForeignKey('test.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    answers = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    test = db.relationship('Test', backref=db.backref('answers', lazy=True))
    user = db.relationship('User', backref=db.backref('submitted_answers', lazy=True))

with app.app_context():
    db.create_all()

def generate_test_id():
    return ''.join(secrets.choice('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') for _ in range(16))

admins_logins = ['admin']

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(username=username, password=hashed_password, email=email, is_admin=username in admins_logins)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid username or password'}), 401

    access_token = create_access_token(identity={'id': user.id, 'is_admin': user.is_admin})
    return jsonify({'access_token': access_token}), 200


@app.route('/tests', methods=['POST'])
@jwt_required()
def create_test():
    current_user = get_jwt_identity()
    if not current_user['is_admin']:
        return jsonify({'error': 'Only admins can create tests'}), 403

    data = request.json
    title = data.get('title')
    description = data.get('description')
    json_data = data.get('json_data')
    unique_link = str(uuid.uuid4())

    test_id = generate_test_id()
    while Test.query.get(test_id):
        test_id = generate_test_id()

    test = Test(
        id=test_id,
        title=title,
        description=description,
        json_data=jsonify(json_data).get_data(as_text=True),
        unique_link=unique_link,
        creator_id=current_user['id']
    )
    db.session.add(test)
    db.session.commit()

    return jsonify({'message': 'Test created', 'unique_link': unique_link, 'id': test_id}), 201


@app.route('/tests/<test_id>/publish', methods=['POST'])
@jwt_required()
def publish_test(test_id):
    current_user = get_jwt_identity()
    if not current_user['is_admin']:
        return jsonify({'error': 'Only admins can publish tests'}), 403

    test = Test.query.get(test_id)
    if not test:
        return jsonify({'error': 'Test not found'}), 404

    if test.creator_id != current_user['id']:
        return jsonify({'error': 'You can only publish your own tests'}), 403

    test.is_published = True
    db.session.commit()
    return jsonify({'message': 'Test published successfully'}), 200


@app.route('/tests/<test_id>', methods=['PUT'])
@jwt_required()
def update_test(test_id):
    current_user = get_jwt_identity()
    if not current_user['is_admin']:
        return jsonify({'error': 'Only admins can update tests'}), 403

    test = Test.query.get(test_id)
    if not test:
        return jsonify({'error': 'Test not found'}), 404

    if test.creator_id != current_user['id']:
        return jsonify({'error': 'You can only modify your own tests'}), 403

    data = request.json
    test.title = data.get('title', test.title)
    test.description = data.get('description', test.description)
    test.json_data = jsonify(data.get('json_data', test.json_data)).get_data(as_text=True)

    test.is_published = data.get('is_published', test.is_published)

    db.session.commit()

    return jsonify({'message': 'Test updated successfully'})


@app.route('/tests/<test_id>/submit', methods=['POST'])
@jwt_required()
def submit_test(test_id):
    current_user = get_jwt_identity()
    data = request.json
    answers = data.get('answers')

    if not answers:
        return jsonify({'error': 'Answers are required'}), 400

    test = Test.query.get(test_id)
    if not test:
        return jsonify({'error': 'Test not found'}), 404

    if not test.is_published:
        return jsonify({'error': 'This test is not published'}), 403

    test_answer = TestAnswer(test_id=test_id, user_id=current_user['id'], answers=jsonify(answers).get_data(as_text=True))
    db.session.add(test_answer)
    db.session.commit()

    return jsonify({'message': 'Test submitted successfully'})


@app.route('/tests/<test_id>/answers', methods=['GET'])
@jwt_required()
def get_test_answers(test_id):
    current_user = get_jwt_identity()
    if not current_user['is_admin']:
        return jsonify({'error': 'Only admins can view test answers'}), 403

    test = Test.query.get(test_id)
    if not test:
        return jsonify({'error': 'Test not found'}), 404

    if current_user['id'] != test.creator_id:
        return jsonify({'error': 'You can only view answers for your own tests'}), 403

    answers = TestAnswer.query.filter_by(test_id=test_id).all()
    return jsonify([{
        'user_id': answer.user_id,
        'answers': answer.answers,
        'timestamp': answer.timestamp.isoformat()
    } for answer in answers])


@app.route('/tests', methods=['GET'])
@jwt_required()
def get_tests():
    current_user = get_jwt_identity()
    if current_user['is_admin']:
        tests = Test.query.filter_by(creator_id=current_user['id']).all()
    else:
        tests = Test.query.filter_by(is_published=True).all()

    return jsonify([{
        'id': test.id,
        'title': test.title,
        'description': test.description,
        'is_published': test.is_published,
        'unique_link': test.unique_link
    } for test in tests])


@app.route('/tests/<test_id>', methods=['DELETE'])
@jwt_required()
def delete_test(test_id):
    current_user = get_jwt_identity()
    if not current_user['is_admin']:
        return jsonify({'error': 'Only admins can delete tests'}), 403

    test = Test.query.get(test_id)
    if not test:
        return jsonify({'error': 'Test not found'}), 404

    if test.creator_id != current_user['id']:
        return jsonify({'error': 'You can only delete your own tests'}), 403

    db.session.delete(test)
    db.session.commit()
    return jsonify({'message': 'Test deleted successfully'}), 200


@app.route('/ping', methods=['GET'])
def test_sql_connection():
    try:
        result = db.session.execute(text('SELECT 1'))
        return jsonify({'message': 'Database is connected', 'result': result.scalar()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False)
