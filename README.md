🌿 PlantCare App

Overview
PlantCare is a full-stack web application that helps plant enthusiasts track their plants and manage care routines like watering, pruning, and fertilizing. Users can create an account, add plants, assign them to categories, and add personalized care notes with schedules and reminders.

Built using Flask for the backend API and React for the frontend client.

Features
🪴 User authentication (signup, login)

🌱 Add, edit, and delete plants

🗂 Categorize plants (e.g., Herbs, Indoor, Succulents)

📅 Add care routines per plant (e.g., watering every 3 days)

🔁 Auto-generate and update care reminders

🔍 Filter plants by category

🎨 Responsive UI with plant details and care timeline

Tech Stack
Frontend	Backend	Database	Other
React	Flask	SQLite	Flask-Migrate, Flask-RESTful, SQLAlchemy-Serializer, Formik, Marshmallow

🚀 Getting Started
1. Clone the Repository
bash
Copy code
git clone https://github.com/<your-username>/plantcare-app.git
cd plantcare-app
2. Backend Setup (Flask)
bash
Copy code
cd server
pipenv install
pipenv shell
flask db init
flask db revision -m "Initial migration"
flask db upgrade
python seed.py        # Optional: add initial test data
python app.py         # Runs on http://localhost:5555
3. Frontend Setup (React)
bash
Copy code
npm install --prefix client
npm start --prefix client    # Runs on http://localhost:3000
📁 Directory Structure
bash
Copy code
plantcare-app/
├── client/           # React frontend
├── server/           # Flask backend
│   ├── app.py
│   ├── config.py
│   ├── models.py
│   ├── seed.py
│   └── ...
├── Pipfile
├── README.md
└── ...
🔌 API Endpoints (Expanded)
Method	Endpoint	Description
GET	/plants	Fetch all plants
POST	/plants	Add a new plant
PATCH	/plants/<id>	Update a specific plant
DELETE	/plants/<id>	Delete a plant
GET	/categories	Get all categories
POST	/categories	Create a new category
GET	/care_notes	Get all care notes
POST	/care_notes	Add a new care note
POST	/signup	Register a new user
POST	/login	Log in a user
DELETE	/logout	Log out a user

🧭 Client-Side Routes (React)
Route	Component	Purpose
/	LandingPage	Home screen after login
/signup	Signup	User registration form
/login	Login	User login form
/logout	Logout	Logs out the current user
/categories/new	NewCategory	Add a new category
/categories/:categoryId/plants	UserCategory	Show plants in a selected category
/plants/new	PlantForm	Add a new plant
/plants/:plantId	PlantDetails	View a plant’s detail page
/care_notes/new	CareNoteForm	Add a new care note for a plant

🔮 Future Features
📱 Mobile responsiveness

🧠 AI care suggestions based on plant type

🤝 Contributing
Pull requests welcome! For major changes, please open an issue first to discuss what you'd like to change.

📄 License
MIT

