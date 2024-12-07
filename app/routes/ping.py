from flask import Blueprint, jsonify
from sqlalchemy import text
from app import db

ping_bh = Blueprint('ping', __name__)


@ping_bh.route('/ping', methods=['GET'])
def test_sql_connection():
    try:
        result = db.session.execute(text('SELECT 1'))
        return jsonify({'message': 'Database is connected', 'result': result.scalar()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
