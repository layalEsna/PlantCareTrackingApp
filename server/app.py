# app.py

from flask import Flask, request, make_response, jsonify, session, redirect, url_for
from flask_restful import Api, Resource
from flask_cors import CORS
from server.config import Config
from server.extensions import db, ma  # Import extensions from extensions.py
from datetime import datetime
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
        
        
        user_schema = UserSchema()
        
        result_user = user_schema.dump(user)
        
        
        return result_user, 200
    

# class Signup(Resource):
    
#     def post(self):

#         try:
#             data = request.get_json()
#             username = data.get('username')
           
#             password = data.get('password')
#             confirm_password = data.get('confirm_password')

#             if not all([username, password, confirm_password]):
#                 return make_response(jsonify({'error': 'All the fields are required.'}), 400)
#             if password != confirm_password:
#                 return make_response(jsonify({'error': 'Password not match.'}), 400)
#             if User.query.filter(User.username==username).first():
#                 return make_response(jsonify({'error': 'unique constraint'}), 400)
            
            
#             new_user = User(
#                 username = username,
#                 password = password,
                
#             )

#             db.session.add(new_user)
#             db.session.commit()            
#             session['user_id'] = new_user.id
#             session.permanent = True 

#             return make_response(jsonify({'id': new_user.id, 'username': new_user.username}), 201)

#         except Exception as e:
#             return make_response(jsonify({'error': f'Internal error: {e}'}), 500)


# class Login(Resource):
#     def post(self):
#         data = request.get_json()
#         username = data.get('username')
#         password = data.get('password')

#         print(f"Login attempt: username='{username}', password='{password}'")

#         if not all([username, password]):
#             print("Error: Missing username or password")
#             return {'error': 'All fields are required'}, 400

#         user = User.query.filter(User.username == username).first()

#         if user:
#             print(f"User found: username='{user.username}', password_hash='{user.password_hash}'")
#         else:
#             print("User not found in database.")

#         if not user or not user.check_password(password):
#             print("Error: Incorrect username or password")
#             return {'error': 'Username or password not found'}, 404

#         print("Login successful")

#         session['user_id'] = user.id
#         session.permanent = True
#         return {
#             'username': user.username,
#             'id': user.id
#         }, 200   

# class NewPlant(Resource):
#     def post(self):
#         user_id = session.get('user_id') 
#         if not user_id:
#             return {'error': 'Unauthorized'}, 401
#         user = User.query.filter(User.id == user_id).first()

#         if not user:
#             return {'error': 'Only users can create new plants.'}, 401
#         data = request.get_json()
#         plant_name = data.get('plant_name')
#         image = data.get('image')
#         created_at = data.get('created_at')
       
#         category_id = data.get('category_id')

#         if not plant_name or not isinstance(plant_name, str):
#             return {'error': 'Plant name is required and must be a string.'}, 400
#         if len(plant_name) < 2 or len(plant_name) > 100:
#             return {'error': 'Plant name must be between 2 and 100 characters.'}, 400
        
#         try:
#             created_at = datetime.strptime(created_at, "%Y-%m-%d")
#         except (ValueError, TypeError):
#             return {'error': 'created_at is required and must be in YYYY-MM-DD format.'}, 400

#         if not isinstance(user_id, int):
#             return {'error': 'user_id is required and must be an integer.'}, 400
#         if not isinstance(category_id, int):
#             return {'error': 'category_id is required and must be an integer.'}, 400

#         category = Category.query.filter(Category.id == category_id).first()
#         if not category:
#             return {'error': 'Category not found'}, 400



#         new_plant = Plant(
#                 plant_name=plant_name,
#                 image=image,
#                 created_at=created_at,
#                 user_id=user_id,
#                 category_id=category_id
#             )

            
#         db.session.add(new_plant)
#         db.session.commit()

#         return {
#                 'plant': {
#                     'id': new_plant.id,
#                     'plant_name': new_plant.plant_name,
#                     'image': new_plant.image,
#                     'created_at': new_plant.created_at.strftime("%Y-%m-%d"),
#                     'user_id': new_plant.user_id,
#                     'category': {
#                         'id': category.id,
#                         'category_name': category.category_name
#                     }
#                 }
#             }, 201  


# class NewCategory(Resource):
#     def post(self):
#         user_id = session.get('user_id')
#         if not user_id:
#             return {'error': 'Unauthorized'}, 401

#         user = User.query.get(user_id)
#         if not user:
#             return {'error': 'Only users can create categories.'}, 401

#         data = request.get_json()
#         category_name = data.get('category_name')

#         if not category_name or not isinstance(category_name, str):
#             return {'error': 'Category name is required and must be a string.'}, 400
#         if len(category_name) < 5 or len(category_name) > 100:
#             return {'error': 'Category name must be between 5 and 100 characters.'}, 400

#         existing_category = Category.query.filter_by(category_name=category_name, user_id=user_id).first()
#         if existing_category:
#             return {'error': 'Category already exists.'}, 400

#         new_category = Category(category_name=category_name, user_id=user_id)
#         db.session.add(new_category)
#         db.session.commit()

#         category_schema = CategorySchema()
#         category_data = category_schema.dump(new_category)
#         return category_data, 201
    
# class Categories(Resource):
#     def get(self):
#         categories = Category.query.all()

#         if not categories:
#             return {'message': 'No category exists.'}, 200

#         return [
#             {
#                 'category_name': category.category_name,
#                     'id': category.id
#                 } for category in categories
#         ], 200

    
api.add_resource(CheckSession,'/check_session')
# api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
# api.add_resource(NewPlant, '/new_plant')
# api.add_resource(Categories, '/categories')
# api.add_resource(NewCategory, '/new_category')



if __name__ == '__main__':
    print("🔥 Running from the correct app file 🔥")
    app.run(port=5555, debug=True)

       
   #python -m server.app    
   # http://localhost:5555/check_session
 # 