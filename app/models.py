from sqlalchemy import JSON

from app import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=True)
    is_admin = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }

class Question(db.Model):
    id = db.Column(db.String(16), primary_key=True)
    type = db.Column(db.String(20), nullable=False)
    textField = db.Column(db.Text, nullable=True)
    fieldTitle = db.Column(db.Text, nullable=True)
    descriptionField = db.Column(db.Text, nullable=True)
    textQuestion = db.Column(db.Text, nullable=True)

    options = db.Column(db.Text, nullable=True)

    url = db.Column(db.Text, nullable=True)

    ratingFrom = db.Column(db.Integer, nullable=True)
    ratingTo = db.Column(db.Integer, nullable=True)

    test_id = db.Column(db.String(16), db.ForeignKey('test.id'), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "fieldTitle": self.fieldTitle,
            "textField": self.textField,
            "url": self.url,
            "textQuestion": self.textQuestion,
            "ratingFrom": self.ratingFrom,
            "ratingTo": self.ratingTo,
            "descriptionField": self.descriptionField,
            "options": self.options,
        }

class Test(db.Model):
    id = db.Column(db.String(16), primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    is_published = db.Column(db.Boolean, default=False)
    unique_link = db.Column(db.String(36), unique=True, nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    creator = db.relationship('User', backref=db.backref('created_tests', lazy=True))
    questions = db.relationship('Question', backref='test', cascade="all, delete-orphan", lazy=True)


class TestAnswer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    test_id = db.Column(db.String(16), db.ForeignKey('test.id'), nullable=False)
    question_id = db.Column(db.String(16), db.ForeignKey('question.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    answer = db.Column(JSON, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    test = db.relationship('Test', backref=db.backref('answers', lazy=True))
    question = db.relationship('Question', backref=db.backref('answers', lazy=True))
    user = db.relationship('User', backref=db.backref('submitted_answers', lazy=True))