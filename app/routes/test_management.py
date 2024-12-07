from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Test
from app import db
import uuid
import secrets

test_mgmt_bp = Blueprint('test_mgmt', __name__)

def generate_test_id():
    return ''.join(secrets.choice('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') for _ in range(16))

@test_mgmt_bp.route('/tests', methods=['POST'])
@jwt_required()
def create_test():
    current_user = get_jwt_identity()
    if not current_user['is_admin']:
        return jsonify({'error': 'Только админы могут создавать тесты'}), 403

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

    return jsonify({'message': 'Тест создан', 'link': f"http://92.118.115.96:8000/tests/{unique_link}", 'id': test_id}), 201

@test_mgmt_bp.route('/tests/<unique_link>/publish', methods=['POST'])
@jwt_required()
def publish_test(unique_link):
    current_user = get_jwt_identity()
    if not current_user['is_admin']:
        return jsonify({'error': 'Только админы могут опубликовать тест'}), 403

    test = Test.query.get(unique_link)
    if not test:
        return jsonify({'error': 'Тест не найден'}), 404

    if test.creator_id != current_user['id']:
        return jsonify({'error': 'Вы можете опубликовать только свой тест'}), 403

    test.is_published = True
    db.session.commit()
    return jsonify({'message': 'Тест успешно опубликован'}), 200


@test_mgmt_bp.route('/tests/<unique_link>', methods=['PUT'])
@jwt_required()
def update_test(unique_link):
    current_user = get_jwt_identity()
    if not current_user['is_admin']:
        return jsonify({'error': 'Только админы могут изменять тест'}), 403

    test = Test.query.get(unique_link)
    if not test:
        return jsonify({'error': 'Тест не найден'}), 404

    if test.creator_id != current_user['id']:
        return jsonify({'error': 'Вы можете изменить только свой тест'}), 403

    data = request.json
    test.title = data.get('title', test.title)
    test.description = data.get('description', test.description)
    test.json_data = jsonify(data.get('json_data', test.json_data)).get_data(as_text=True)

    test.is_published = data.get('is_published', test.is_published)

    db.session.commit()

    return jsonify({'message': 'Тест успешно обнавлен'})

@test_mgmt_bp.route('/tests/<unique_link>', methods=['GET'])
def get_test(unique_link):
    tests = Test.query.filter_by(unique_link=unique_link).all()

    if len(tests) == 0:
        return jsonify({'error': 'Тест не найден'}), 404

    return jsonify([{
        'id': test.id,
        'title': test.title,
        'description': test.description,
        'is_published': test.is_published,
        'json_data': test.json_data,
        'unique_link': test.unique_link
    } for test in tests])

@test_mgmt_bp.route('/tests', methods=['GET'])
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
        'unique_link': test.unique_link,
        'creator': test.creator
    } for test in tests])

@test_mgmt_bp.route('/tests/<unique_link>', methods=['DELETE'])
@jwt_required()
def delete_test(unique_link):
    current_user = get_jwt_identity()
    if not current_user['is_admin']:
        return jsonify({'error': 'Только админы могут удалять тесты'}), 403

    test = Test.query.get(unique_link)
    if not test:
        return jsonify({'error': 'Тест не найден'}), 404

    if test.creator_id != current_user['id']:
        return jsonify({'error': 'Вы можете удалить только свой тест'}), 403

    db.session.delete(test)
    db.session.commit()
    return jsonify({'message': 'Тест удален'}), 200
