# app.py

from flask import Flask, request, make_response, jsonify, session, redirect, url_for
from flask_restful import Api, Resource
from flask_cors import CORS
from server.config import Config
from server.extensions import db, ma  # Import extensions from extensions.py
from datetime import datetime, timedelta, date
from dotenv import load_dotenv
from flask_migrate import Migrate

load_dotenv()
import os

# Initialize Flask app
app = Flask(__name__)

# Set app configurations
app.config.from_object(Config)
app.config['FLASK_DEBUG'] = 1

# Initialize extensions
db.init_app(app)
ma.init_app(app)
migrate = Migrate(app, db)


from server.models import User, Plant, Category, CareNote, UserSchema, CategorySchema, PlantSchema, CareNoteSchema

# Initialize API
api = Api(app)
CORS(app, supports_credentials=True)

# Routes and other app setup...


# Define routes and other logic...

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

@app.route('/logout')
def logout():
    session.clear() 
    return redirect(url_for('index')) 




class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {'error': 'Unauthorized.'}, 401

        user = User.query.get(user_id)
        if not user:
            return {'error': 'User not found.'}, 404
        
        user_info = {
            'id': user.id,
            'username': user.username,
        }   

        categories_data = []     

        for category in user.categories:
            category_data = {
                'id': category.id,
                'category_name': category.category_name,
                'plants': []
            }   

            plants = Plant.query.filter(Plant.user_id == user_id, Plant.category_id == category.id).all()   
            for plant in plants:
                plant_data = {
                    'id': plant.id,
                    'plant_name': plant.plant_name,
                    'image': plant.image,
                    'created_at': plant.created_at.strftime('%Y-%m-%d'),
                    'user_id': plant.user_id,
                    'category_id': plant.category_id,
                    'care_notes': []
                }   

                for care_note in plant.care_notes:
                    care_note_data = {
                        'id': care_note.id,
                        'care_type': care_note.care_type,
                        'frequency': care_note.frequency,
                        'starting_date': care_note.starting_date.strftime('%y-%m-%d'),

                        'next_care_date': care_note.next_care_date.strftime('%Y-%m-%d'),
                        'plant_id': care_note.plant_id,
                    }

                    plant_data['care_notes'].append(care_note_data)
                category_data['plants'].append(plant_data)
            categories_data.append(category_data)
        return{
            **user_info,
            'categories': categories_data
        }
        
         



class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        print(f"Login attempt: username='{username}', password='{password}'")

        if not all([username, password]):
            print("Error: Missing username or password")
            return {'error': 'All fields are required'}, 400

        user = User.query.filter(User.username == username).first()

        if user:
            print(f"User found: username='{user.username}', password_hash='{user.password_hash}'")
        else:
            print("User not found in database.")

        if not user or not user.check_password(password):
            print("Error: Incorrect username or password")
            return {'error': 'Username or password not found'}, 404

        print("Login successful")

        session['user_id'] = user.id
        session.permanent = True
        return {
            'username': user.username,
            'id': user.id
        }, 200   




class NewPlant(Resource):
    def post(self):
        user_id = session.get('user_id') 
        if not user_id:
            return {'error': 'Unauthorized'}, 401
        user = User.query.filter(User.id == user_id).first()

        if not user:
            return {'error': 'Only users can create new plants.'}, 401
        data = request.get_json()
        plant_name = data.get('plant_name')
        image = data.get('image')
        created_at = data.get('created_at')
       
        category_id = data.get('category_id')

        if not plant_name or not isinstance(plant_name, str):
            return {'error': 'Plant name is required and must be a string.'}, 400
        if len(plant_name) < 2 or len(plant_name) > 100:
            return {'error': 'Plant name must be between 2 and 100 characters.'}, 400
        
        try:
            created_at = datetime.strptime(created_at, "%Y-%m-%d")
        except (ValueError, TypeError):
            return {'error': 'created_at is required and must be in YYYY-MM-DD format.'}, 400

        if not isinstance(user_id, int):
            return {'error': 'user_id is required and must be an integer.'}, 400
        if not isinstance(category_id, int):
            return {'error': 'category_id is required and must be an integer.'}, 400

        category = Category.query.filter(Category.id == category_id).first()
        if not category:
            return {'error': 'Category not found'}, 400



        new_plant = Plant(
                plant_name=plant_name,
                image=image,
                created_at=created_at,
                user_id=user_id,
                category_id=category_id
            )

            
        db.session.add(new_plant)
        db.session.commit()

        return {
                'plant': {
                    'id': new_plant.id,
                    'plant_name': new_plant.plant_name,
                    'image': new_plant.image,
                    'created_at': new_plant.created_at.strftime("%Y-%m-%d"),
                    'user_id': new_plant.user_id,
                    'category': {
                        'id': category.id,
                        'category_name': category.category_name
                    }
                }
            }, 201  


class NewCategory(Resource):
    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return {'error': 'Unauthorized'}, 401

        user = User.query.get(user_id)
        if not user:
            return {'error': 'Only users can create categories.'}, 401

        data = request.get_json()
        category_name = data.get('category_name')

        if not category_name or not isinstance(category_name, str):
            return {'error': 'Category name is required and must be a string.'}, 400
        if len(category_name) < 5 or len(category_name) > 100:
            return {'error': 'Category name must be between 5 and 100 characters.'}, 400

        existing_category = Category.query.filter_by(category_name=category_name).first()
        if existing_category:
            return {'error': 'Category already exists.'}, 400

        new_category = Category(category_name=category_name)
        db.session.add(new_category)
        db.session.commit()
        
        category_schema = CategorySchema()
        category_data = category_schema.dump(new_category)
        return category_data, 201
    
class Categories(Resource):
    def get(self):
        categories = Category.query.all()

        if not categories:
            return {'message': 'No category exists.'}, 200

        return [
            {
                'category_name': category.category_name,
                    'id': category.id
                } for category in categories
        ], 200
    
class CareNoteForm(Resource):
    def post(self):

        data = request.get_json()
        care_type = data.get('care_type')
        frequency = data.get('frequency')
        starting_date_str = data.get('starting_date')
        plant_id = data.get('plant_id')

                
        if not care_type or not isinstance(care_type, str):
            return {'error': 'Care type is required and must be a string.'}, 400
        if len(care_type) < 5 or len(care_type) > 100:
            return {'error': 'care type must be between 5 and 100 characters.'}, 400
        if not frequency or not isinstance(frequency, int):
            return {'error': 'Frequency is required and must be an integer.'}
        if frequency < 1:
            return {'error': 'Frequency must be a positive integer.'}, 400
        
        try:
            starting_date = datetime.strptime(starting_date_str, '%Y-%m-%d').date()
        except (ValueError, TypeError):
            return {'error': 'starting_date is required and must be a valid date (YYYY-MM-DD).'}, 400

       
        next_care_date = starting_date + timedelta(days=frequency)
        if not plant_id:
            return {'error': 'plant id is required.'}, 400
        
        new_care_note = CareNote(
            care_type = care_type,
            frequency = frequency,
            starting_date = starting_date,
            next_care_date = next_care_date,
            plant_id = plant_id

        )
        db.session.add(new_care_note)
        db.session.commit()

        care_note_schema = CareNoteSchema()
        care_note_data = care_note_schema.dump(new_care_note)
        return care_note_data, 201
    
class DeletePlant(Resource):
    def delete(self, plant_id):
        user_id = session.get('user_id')
        if not user_id:
            return {'error': 'Unauthorized'}, 401
        plant = Plant.query.filter(Plant.id == plant_id, Plant.user_id == user_id).first()
        if not plant:
            return {'error': 'Plant not found or you do not have permission to delete it.'}, 404

        db.session.delete(plant)
        db.session.commit()
        return {'message': 'Plant deleted successfully.'}, 200


    
api.add_resource(CheckSession, '/check_session')
# api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(NewPlant, '/new_plant')
api.add_resource(Categories, '/categories')
api.add_resource(NewCategory, '/new_category')
api.add_resource(CareNoteForm, '/new_care_note')
api.add_resource(DeletePlant, '/plant/<int:plant_id>')



if __name__ == '__main__':
    print("🔥 Running from the correct app file 🔥")
    app.run(port=5555, debug=True)

       
   #python -m server.app    
   # http://localhost:5555/check_session
 # 