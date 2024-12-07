from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy


bcrypt = Bcrypt()
jwt = JWTManager()
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://example.com"]}})

    bcrypt.init_app(app)
    jwt.init_app(app)
    db.init_app(app)

    with app.app_context():
        from app.models import User, Test, TestAnswer
        db.create_all()

    from app.routes.auth import auth_bp
    from app.routes.test_management import test_mgmt_bp
    from app.routes.test_submission import test_submission_bp
    from app.routes.auth import auth_bp
    from app.routes.ping import ping_bh

    app.register_blueprint(ping_bh)
    app.register_blueprint(auth_bp)
    app.register_blueprint(test_mgmt_bp)
    app.register_blueprint(test_submission_bp)

    return app
