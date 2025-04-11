# import sys
# import os
# sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# from server.app import app
# from datetime import datetime

# from server.models import db, User, Category, Plant, CareNote

# if __name__ == '__main__':
#     with app.app_context():
#         print("🌱 Starting seed...")

#         # Reset the database
#         db.drop_all()
#         db.create_all()

#         # Create users
#         user1 = User(username='Lunaxx')
#         user1.password = 'Ddddddddd!'
#         user2 = User(username='Darya')
#         user2.password = 'Ddddddddd!'
#         user3 = User(username='Pardis')
#         user3.password = 'Ddddddddd!'
#         user4 = User(username='Arshia')
#         user4.password = 'Ddddddddd!'

#         db.session.add_all([user1, user2, user3, user4])
#         db.session.commit()

#         # Create categories
#         categories = [
#             Category(category_name='Succulents'),
#             Category(category_name='Ferns'),
#             Category(category_name='Flowering Plants')
#         ]
#         db.session.add_all(categories)
#         db.session.commit()

#         # Create plants and assign to users and categories
#         plant_data = [
#             ('Aloe Vera', 'image1.jpg', '2023-03-02', user1, categories[0]),
#             ('Spider Plant', 'image2.jpg', '2023-06-02', user2, categories[1]),
#             ('Peace Lily', 'image3.jpg', '2024-03-02', user3, categories[2]),
#             ('Cactus', 'image4.jpg', '2023-06-02', user4, categories[0]),
#             ('Snake Plant', 'image5.jpg', '2021-10-02', user2, categories[0]),
#             ('Fern', 'image6.jpg', '2023-03-12', user4, categories[1]),
#             ('Rose', 'image7.jpg', '2023-01-01', user1, categories[2]),
#             ('Orchid', 'image8.jpg', '2023-02-02', user3, categories[1])
#         ]

#         plants = []  # Initialize the plants list
#         for name, image, created_at, user, category in plant_data:
#             plant = Plant(
#                 plant_name=name,
#                 image=image,
#                 created_at=datetime.strptime(created_at, '%Y-%m-%d'),
#                 user=user,
#                 category=category
#             )
#             db.session.add(plant)
#             plants.append(plant)
#             print(f"Created plant '{name}' for user '{user.username}' in category '{category.category_name}'")

#         db.session.commit()

        
#         plants = Plant.query.all()

      
#         care_notes = [
#             ('Watering', 5, '2023-03-01', plants[0]),  # Aloe Vera
#             ('Fertilizing', 30, '2023-03-05', plants[1]),  # Spider Plant
#             ('Watering', 7, '2023-03-10', plants[2]),  # Peace Lily
#             ('Pruning', 10, '2023-03-15', plants[3]),  # Cactus
#             ('Watering', 3, '2023-02-15', plants[4]),  # Snake Plant
#             ('Repotting', 90, '2023-04-01', plants[5]),  # Fern
#         ]
#         for care_type, frequency, starting_date, plant in care_notes:
#             care_note = CareNote(
#                 care_type=care_type,
#                 frequency=frequency,
#                 starting_date=datetime.strptime(starting_date, '%Y-%m-%d'),
#                 next_care_date=datetime.strptime(starting_date, '%Y-%m-%d'),
#                 plant_id=plant.id
#             )
#             db.session.add(care_note)
#             print(f"Created care note for plant '{plant.plant_name}'")

#         db.session.commit()

#         print("🌱 Seeding complete! Users, plants, and care notes created.")
