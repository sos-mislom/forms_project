import json
from datetime import datetime

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import TestAnswer, Test, Question, TotalScore
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

    total_score = 0
    max_score = 0

    for answer_data in answers:
        question_id = answer_data.get('question_id')
        answer_value = answer_data.get('answer')

        if not question_id or not answer_value:
            return jsonify({'error': 'Каждый ответ должен содержать question_id и answer'}), 400

        question = Question.query.filter_by(id=question_id, test_id=test.id).first()
        if not question:
            return jsonify({'error': f'Вопрос с id {question_id} не найден в этом тесте'}), 404

        correct_answers = json.loads(question.correct_answers or "[]")

        if isinstance(answer_value, list):
            is_correct = set(answer_value) == set(correct_answers)
        else:
            is_correct = answer_value in correct_answers

        if is_correct:
            total_score += question.score

        max_score += question.score

        test_answer = TestAnswer(
            test_id=test.id,
            question_id=question_id,
            user_id=current_user['id'],
            answer=answer_value,
            timestamp=datetime.utcnow()
        )
        db.session.add(test_answer)

    total_score_entry = TotalScore.query.filter_by(user_id=current_user['id'], test_id=test.id).first()
    if total_score_entry:
        total_score_entry.total_score = total_score
    else:
        total_score_entry = TotalScore(user_id=current_user['id'],
                                       test_id=test.id, total_score=total_score, max_score=max_score)
        db.session.add(total_score_entry)

    db.session.commit()

    return jsonify({'message': 'Ответы успешно отправлены', 'total_score': total_score, 'max_score': max_score})


@test_submission_bp.route('/tests/<unique_link>/result', methods=['POST'])
@jwt_required()
def get_test_result(unique_link):
    current_user = get_jwt_identity()

    data = request.get_json()
    requires_percentage = data.get('requires_score', 0)

    test = Test.query.filter_by(unique_link=unique_link).first()
    if not test:
        return jsonify({'error': 'Тест не найден'}), 404

    is_author = test.creator_id == current_user['id']

    if not is_author:
        result = TotalScore.query.filter_by(user_id=current_user['id'], test_id=test.id).first()
        if not result:
            return jsonify({'error': 'Результат теста не найден'}), 404

        if result.total_score >= result.max_score * (requires_percentage / 100):
            return jsonify({
                'total_score': result.total_score,
                'test_id': result.test_id,
                'user_id': result.user_id,
                'max_score': result.max_score,
                'timestamp': result.timestamp.isoformat()
            })
        else:
            return jsonify({'error': 'Недостаточно баллов для просмотра результата'}), 403

    results = TotalScore.query.filter_by(test_id=test.id).all()
    filtered_results = [
        {
            'total_score': result.total_score,
            'test_id': result.test_id,
            'user_id': result.user_id,
            'max_score': result.max_score,
            'timestamp': result.timestamp.isoformat()
        }
        for result in results if result.total_score >= result.max_score * (requires_percentage / 100)
    ]

    return jsonify(filtered_results)


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
