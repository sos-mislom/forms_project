from flask import Blueprint, request, jsonify
from app.models import User
from app import bcrypt, db
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

admins_logins = ['admin']

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json

    lastName = data.get('lastName')
    username = str(data.get('username')) + " " + str(lastName)
    userType = data.get('userType')

    password = data.get('password')
    email = data.get('email')

    if not username or not password:
        return jsonify({'error': 'Необходимо ввести логин и пароль'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Такой логин уже существует'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email уже занят'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    is_admin = False
    if userType == "editor" or username in admins_logins:
        is_admin=True

    user = User(username=username, password=hashed_password, email=email, is_admin=is_admin)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'Регистрация успешна'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and not bcrypt.check_password_hash(user.password, password):
        return jsonify({'error': 'Неправильный логин или пароль'}), 401

    if not user:
        user = User.query.filter_by(email=username).first()

        if not user or not bcrypt.check_password_hash(user.password, password):
            return jsonify({'error': 'Неправильный логин или пароль'}), 401


    access_token = create_access_token(identity={'id': user.id, 'is_admin': user.is_admin})
    return jsonify({'access_token': access_token, 'userType': 'editor' if user.is_admin else 'student'}), 200
