from datetime import datetime

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import TestAnswer, Test, Question
from app import db

test_submission_bp = Blueprint('test_submission', __name__, url_prefix='/api')

@test_submission_bp.route('/tests/<unique_link>/submit', methods=['POST'])
@jwt_required()
def submit_test(unique_link):
    current_user = get_jwt_identity()
    data = request.json
    answers = data.get('answers')

    if not answers:
        return jsonify({'error': 'Необходимо предоставить ответы'}), 400

    test = Test.query.filter_by(unique_link=unique_link).first()
    if not test:
        return jsonify({'error': 'Тест не найден'}), 404

    if not test.is_published:
        return jsonify({'error': 'Этот тест не опубликован'}), 403

    for answer_data in answers:
        question_id = answer_data.get('question_id')
        answer_value = answer_data.get('answer')  # Может быть строкой или списком

        if not question_id or not answer_value:
            return jsonify({'error': 'Каждый ответ должен содержать question_id и answer'}), 400

        question = Question.query.filter_by(id=question_id, test_id=test.id).first()
        if not question:
            return jsonify({'error': f'Вопрос с id {question_id} не найден в этом тесте'}), 404

        test_answer = TestAnswer(
            test_id=test.id,
            question_id=question_id,
            user_id=current_user['id'],
            answer=answer_value,
            timestamp=datetime.utcnow()
        )
        db.session.add(test_answer)

    db.session.commit()
    return jsonify({'message': 'Ответы успешно отправлены'})


@test_submission_bp.route('/tests/<unique_link>/answers', methods=['GET'])
@jwt_required()
def get_test_answers(unique_link):
    current_user = get_jwt_identity()
    if not current_user['is_admin']:
        return jsonify({'error': 'Только админы могут просматривать ответы'}), 403

    test = Test.query.filter_by(unique_link=unique_link).first()
    if not test:
        return jsonify({'error': 'Тест не найден'}), 404

    if current_user['id'] != test.creator_id:
        return jsonify({'error': 'Вы можете смотреть ответы только на свои тесты'}), 403

    answers = TestAnswer.query.filter_by(test_id=test.id).all()

    return jsonify([{
        'user_id': answer.user_id,
        'question_id': answer.question_id,
        'answer': answer.answer if isinstance(answer.answer, list) else [answer.answer],
        'timestamp': answer.timestamp.isoformat()
    } for answer in answers])


@test_submission_bp.route('/completed-tests', methods=['GET'])
@jwt_required()
def get_completed_tests():
    current_user = get_jwt_identity()

    completed_tests = (Test.query.join(TestAnswer, Test.id == TestAnswer.test_id)
                       .filter(TestAnswer.user_id == current_user['id']).distinct().all())

    return jsonify([{
        'test_id': test.id,
        'title': test.title,
        'description': test.description,
        'unique_link': test.unique_link
    } for test in completed_tests])