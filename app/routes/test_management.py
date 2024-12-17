from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Test, Question, User
from app import db
import uuid
import secrets

test_mgmt_bp = Blueprint('test_mgmt', __name__, url_prefix='/api')

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
    questions = data.get('questions', [])
    unique_link = str(uuid.uuid4())

    test_id = generate_test_id()
    while Test.query.get(test_id):
        test_id = generate_test_id()

    test = Test(
        id=test_id,
        title=title,
        description=description,
        unique_link=unique_link,
        is_published=True,
        creator_id=current_user['id']
    )
    
    db.session.add(test)

    for question_data in questions:
        question = Question(
            id=question_data.get('id'),
            test_id=test_id,
            type=question_data.get('type'),
            textField=question_data.get('textField'),
            fieldTitle=question_data.get('fieldTitle'),
            descriptionField=question_data.get('descriptionField'),
            options=jsonify(question_data.get('options', [])).get_data(as_text=True),
            ratingFrom=question_data.get('ratingFrom'),
            ratingTo=question_data.get('ratingTo'),
            url=question_data.get('url'),
            textQuestion=question_data.get('textQuestion')
        )
        db.session.add(question)

    db.session.commit()

    return jsonify({'message': 'Тест создан',
                    'link': f"http://92.118.115.96:8000/tests/{unique_link}",
                    'id': test_id}), 201

@test_mgmt_bp.route('/tests/<unique_link>/publish', methods=['POST'])
@jwt_required()
def publish_test(unique_link):
    current_user = get_jwt_identity()
    if not current_user['is_admin']:
        return jsonify({'error': 'Только админы могут опубликовать тест'}), 403

    test = Test.query.filter_by(unique_link=unique_link).first()
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
        return jsonify({'error': 'Только админы могут изменять тесты'}), 403

    test = Test.query.filter_by(unique_link=unique_link).first()
    if not test:
        return jsonify({'error': 'Тест не найден'}), 404

    if test.creator_id != current_user['id']:
        return jsonify({'error': 'Вы можете изменить только свой тест'}), 403

    data = request.json
    test.title = data.get('title', test.title)
    test.description = data.get('description', test.description)
    test.is_published = data.get('is_published', test.is_published)

    updated_questions = data.get('questions', [])
    existing_question_ids = {q.id for q in Question.query.filter_by(test_id=test.id).all()}

    for question_data in updated_questions:
        question_id = question_data.get('id')
        if question_id in existing_question_ids:
            question = Question.query.get(question_id)
            question.type = question_data.get('type', question.type)
            question.textField = question_data.get('textField', question.textField)
            question.fieldTitle = question_data.get('fieldTitle', question.fieldTitle)
            question.descriptionField = question_data.get('descriptionField', question.descriptionField)
            question.options = jsonify(question_data.get('options', [])).get_data(as_text=True)
            question.ratingFrom = question_data.get('ratingFrom', question.ratingFrom)
            question.ratingTo = question_data.get('ratingTo', question.ratingTo)
            question.url = question_data.get('url', question.url)
            question.textQuestion = question_data.get('textQuestion', question.textQuestion)
        else:
            new_question = Question(
                id=str(uuid.uuid4()),
                test_id=test.id,
                type=question_data['type'],
                textField=question_data.get('textField'),
                fieldTitle=question_data.get('fieldTitle'),
                descriptionField=question_data.get('descriptionField'),
                options=jsonify(question_data.get('options', [])).get_data(as_text=True),
                ratingFrom=question_data.get('ratingFrom'),
                ratingTo=question_data.get('ratingTo'),
                url=question_data.get('url'),
                textQuestion=question_data.get('textQuestion')
            )
            db.session.add(new_question)

    incoming_question_ids = {q.get('id') for q in updated_questions}
    for question in Question.query.filter_by(test_id=test.id).all():
        if question.id not in incoming_question_ids:
            db.session.delete(question)

    db.session.commit()

    return jsonify({'message': 'Тест успешно обновлен'})


@test_mgmt_bp.route('/tests/<unique_link>', methods=['GET'])
def get_test(unique_link):
    test = Test.query.filter_by(unique_link=unique_link).first()

    if not test:
        return jsonify({'error': 'Тест не найден'}), 404

    return jsonify({
        'id': test.id,
        'title': test.title,
        'description': test.description,
        'is_published': test.is_published,
        'questions': [
            {
                'id': question.id,
                'type': question.type,
                'textField': question.textField,
                'fieldTitle': question.fieldTitle,
                'descriptionField': question.descriptionField,
                'options': question.options,
                'ratingFrom': question.ratingFrom,
                'ratingTo': question.ratingTo,
                'url': question.url,
                'textQuestion': question.textQuestion
            }
            for question in Question.query.filter_by(test_id=test.id).all()
        ],
        'unique_link': test.unique_link
    })


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
        'creator': User.query.filter_by(id=test.creator_id).first().
        to_dict() if not current_user['is_admin'] else "You"
    } for test in tests])


@test_mgmt_bp.route('/tests/<unique_link>', methods=['DELETE'])
@jwt_required()
def delete_test(unique_link):
    current_user = get_jwt_identity()
    if not current_user['is_admin']:
        return jsonify({'error': 'Только админы могут удалять тесты'}), 403

    test = Test.query.filter_by(unique_link=unique_link).first()
    if not test:
        return jsonify({'error': 'Тест не найден'}), 404

    if test.creator_id != current_user['id']:
        return jsonify({'error': 'Вы можете удалить только свой тест'}), 403

    try:
        for question in Question.query.filter_by(test_id=test.id).all():
            db.session.delete(question)
    except Exception:
        pass

    db.session.delete(test)
    db.session.commit()

    return jsonify({'message': 'Тест удален'}), 200


@test_mgmt_bp.route('/tests', methods=['OPTIONS'])
def options():
    return '', 200
