from flask import Flask
from flask_mongoengine import MongoEngine
import flask_login as flask_login


app = Flask(__name__)
app.config.from_object("config")

db = MongoEngine(app)

login_manager = flask_login.LoginManager()
login_manager.init_app(app)

from app import models, views