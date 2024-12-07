from app import db
from datetime import datetime

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