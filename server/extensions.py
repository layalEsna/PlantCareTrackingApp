from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
# extensions.py

from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()


db = SQLAlchemy()
ma = Marshmallow()