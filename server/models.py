
# models.py

from server.extensions import db, bcrypt  # Use db from extensions.py
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field
from sqlalchemy.orm import validates, relationship
from werkzeug.security import generate_password_hash, check_password_hash
from marshmallow import fields
from datetime import date
import re


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    plants = db.relationship('Plant', back_populates='user', lazy='joined')
    # categories = db.relationship('Category', secondary='plants', back_populates='users')
    # care_notes = db.relationship('CareNote', secondary='plants', back_populates='users')

    categories = db.relationship(
        "Category",
        secondary="plants",
        primaryjoin="User.id == Plant.user_id",
        secondaryjoin="Plant.category_id == Category.id",
        viewonly=True
    )
    @validates('username')
    def validate_username(self, key, username):
        if not username or not isinstance(username, str):
            raise ValueError('Username is required and must be a string.')
        if len(username) < 5 or len(username) > 100:
            raise ValueError('Username must be between 5 and 100 characters inclusive.')
        return username
    # @property
    # def categories(self):
    #     return list({plant.category for plant in self.plants})


    @property
    def password(self):
        raise AttributeError('Password is read-only.')

    @password.setter
    def password(self, password):
        pattern = re.compile(r'^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*]).{8,}$')
        if not password or not isinstance(password, str):
            raise ValueError('Password is required and must be a string')
        if not pattern.match(password):
            raise ValueError('Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, and one symbol')
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        print(f"Stored hash: {self.password_hash}")
        print(f"Input password: {password}")
        result = bcrypt.check_password_hash(self.password_hash, password)
        print(f"Bcrypt result: {result}")
        return result

    
class Plant(db.Model):
    __tablename__ = 'plants'

    id = db.Column(db.Integer, primary_key=True)
    plant_name = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String, nullable=True)
    created_at = db.Column(db.Date, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)

    user = db.relationship('User', back_populates='plants')
    category = db.relationship('Category', back_populates='plants')
    care_notes = db.relationship('CareNote', back_populates='plant', cascade="all, delete-orphan")

    @validates('plant_name')
    def validate_plant_name(self, key, plant_name):
        if not plant_name or not isinstance(plant_name, str):
            raise ValueError('Plant_name is required and must be a string.')
        if len(plant_name) < 2 or len(plant_name) > 100:
            raise ValueError('plant_name must be between 2 and 100 characters inclusive.')
        return plant_name
    @validates('created_at')
    def validate_created_at(self, key, created_at):
        if not created_at or not isinstance(created_at, date):
            raise ValueError('created_at is required and must be a date type.')
        return created_at
            
class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String(100), nullable=False, unique=True)
    
    plants = db.relationship('Plant', back_populates='category')
    
    @validates('category_name')
    def validate_category_name(self, key, category_name):
        if not category_name or not isinstance(category_name, str):
            raise ValueError('Category_name is required and must be a string.')
        if len(category_name) < 5 or len(category_name) > 100:
            raise ValueError('category_name must be between 5 and 100 characters inclusive.')
        return category_name
    def __hash__(self):
        return hash(self.id)

class CareNote(db.Model):
    __tablename__ = 'care_notes'

    id = db.Column(db.Integer, primary_key=True)
    care_type = db.Column(db.String(100), nullable=False)
    frequency = db.Column(db.Integer, nullable=False)
    starting_date = db.Column(db.Date, nullable=False)
    next_care_date = db.Column(db.Date, nullable=False)
   

    plant_id = db.Column(db.Integer, db.ForeignKey('plants.id'), nullable=False)
    plant = db.relationship('Plant', back_populates='care_notes')
    # plants = db.relationship("Plant", backref="category")

    
    @validates('care_type')
    def validate_care_type(self, key, care_type):
        if not care_type or not isinstance(care_type, str):
            raise ValueError('care_type is required and must be a string.')
        if len(care_type) < 5 or len(care_type) > 100:
            raise ValueError('care_type must be between 5 and 100 characters inclusive.')
        return care_type
    
    @validates('frequency')
    def validate_frequency(self, key, frequency):
        if not frequency or not isinstance(frequency, int):
            raise ValueError('Frequency is required and must be an integer.')
        if frequency < 1:
            raise ValueError('Frequency must be a positive integer.')
        return frequency

    @validates('starting_date')
    def validate_starting_date(self, key, starting_date):
        if not starting_date or not isinstance(starting_date, date):
            raise ValueError('starting_date is required and must be a date type.')
        return starting_date
        
    @validates('next_care_date')
    def validate_next_care_date(self, key, next_care_date):
        if not next_care_date or not isinstance(next_care_date, date):
            raise ValueError('next_care_date is required and must be a date type.')
        return next_care_date
        
        

class PlantSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Plant
        load_instance = True
    user = fields.Nested('UserSchema', exclude=('plants',))  
    category = fields.Nested('CategorySchema', exclude=('plants',))  
   
    care_notes = fields.Nested('CareNoteSchema', many=True, exclude=('plant',))
    created_at = fields.Date(format='%Y-%m-%d')
    category_id = auto_field()
    user_id = auto_field()

class CategorySchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Category
        load_instance = True
    plants = fields.Nested('PlantSchema', many=True, exclude=('category', 'user', 'care_notes'))
    
    

class CareNoteSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = CareNote
        load_instance = True
    plant = fields.Nested('PlantSchema', exclude=('user', 'care_notes',))
    starting_date = fields.Date(format='%Y-%m-%d')
    next_care_date = fields.Date(format='%Y-%m-%d')

class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_relationships = True
        load_instance = True
    
        exclude = ('password_hash',)
    categories = fields.Nested('CategorySchema', many=True, exclude=('plants',))
    # categories = fields.Method('get_categories')

    plants = fields.Nested('PlantSchema', many=True, exclude=('user',))  

    # def get_categories(self, user):
    #     if not user.plants:
    #         return []
    
    #     category_set = {plant.category for plant in user.plants if plant.category}
    #     return CategorySchema(many=True).dump(list(category_set))
    
