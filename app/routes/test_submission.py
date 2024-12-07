from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import TestAnswer, Test
from app import db

test_submission_bp = Blueprint('test_submission', __name__)


@test_submission_bp.route('/tests/<unique_link>/submit', methods=['POST'])
@jwt_required()
def submit_test(unique_link):
    current_user = get_jwt_identity()
    data = request.json
    answers = data.get('answers')

    if not answers:
        return jsonify({'error': 'Необходимо предоставить ответы'}), 400

    test = Test.query.get(unique_link)
    if not test:
        return jsonify({'error': 'Тест не найден'}), 404

    if not test.is_published:
        return jsonify({'error': 'Этот тест не опубликован'}), 403

    test_answer = TestAnswer(test_id=test.id, user_id=current_user['id'], answers=jsonify(answers).get_data(as_text=True))
    db.session.add(test_answer)
    db.session.commit()

    return jsonify({'message': 'Ответы отправлены'})


@test_submission_bp.route('/tests/<unique_link>/answers', methods=['GET'])
@jwt_required()
def get_test_answers(unique_link):
    current_user = get_jwt_identity()
    if not current_user['is_admin']:
        return jsonify({'error': 'Только админы могут просматривать ответы'}), 403

    test = Test.query.get(unique_link)
    if not test:
        return jsonify({'error': 'Тест не найден'}), 404

    if current_user['id'] != test.creator_id:
        return jsonify({'error': 'Вы можете смотреть ответы только на свои тесты'}), 403

    answers = TestAnswer.query.filter_by(test_id=test.id).all()
    return jsonify([{
        'user_id': answer.user_id,
        'answers': answer.answers,
        'timestamp': answer.timestamp.isoformat()
    } for answer in answers])
