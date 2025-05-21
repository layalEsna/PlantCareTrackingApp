🌿 PlantCare App
Overview
PlantCare is a full-stack web application that helps plant enthusiasts track their plants and manage care routines like watering, pruning, and fertilizing.

Users can:

Create an account

Add and categorize plants

Add personalized care notes with schedules and reminders

Built with Flask (Python) on the backend and React (JavaScript) on the frontend.

✨ Features
🪴 User authentication (signup, login)

🌱 Add, edit, and delete plants

🗂 Categorize plants (e.g., Herbs, Indoor, Succulents)

📅 Add and update care routines (e.g., watering every 3 days)

🔁 Auto-generate care reminders

🔍 Filter plants by category

🎨 Responsive UI with plant details and care timeline

🛠 Tech Stack
Frontend	Backend	Database	Other Tools
React	Flask	SQLite	Flask-Migrate, Flask-RESTful, SQLAlchemy-Serializer, Formik, Marshmallow

🚀 Getting Started
1. Clone the Repository
git clone https://github.com/layalEsna/PlantCareTrackingApp.git
cd PlantCareTrackingApp

2. Backend Setup (Flask)
cd server
pipenv install
pipenv shell
flask db init
flask db revision -m "Initial migration"
flask db upgrade
python seed.py        # Optional: adds initial test data
python app.py         # Runs backend on http://localhost:5555


3. Frontend Setup (React)
npm install --prefix client
npm start --prefix client    # Runs frontend on http://localhost:3000

📁 Project Structure
PlantCareTrackingApp/
├── client/               # React frontend
├── server/               # Flask backend
│   ├── app.py
│   ├── config.py
│   ├── models.py
│   ├── seed.py
│   └── ...
├── Pipfile
├── README.md
└── ...

🌐 API Endpoints
| Endpoint                    | Method | Description                           |
| --------------------------- | ------ | ------------------------------------- |
| `/check_session`            | GET    | Check if the user is logged in        |
| `/signup`                   | POST   | Register a new user                   |
| `/login`                    | POST   | Authenticate a user and start session |
| `/logout`                   | POST   | Terminate user session                |
| `/categories`               | GET    | Get list of plant categories          |
| `/categories/new`           | POST   | Create a new category                 |
| `/plants/new`               | POST   | Add a new plant                       |
| `/plants/:plant_id`         | DELETE | Delete a plant by ID                  |
| `/care_notes/new`           | POST   | Add a care note for a plant           |
| `/care_notes/:care_note_id` | DELETE | Delete a care note by ID              |
| `/care_notes/:care_note_id` | PUT    | Update an existing care note by ID    |

🧭 React Routes
| Route                            | Component    | Purpose                          |
| -------------------------------- | ------------ | -------------------------------- |
| `/`                              | LandingPage  | Home screen after login          |
| `/signup`                        | Signup       | User registration form           |
| `/login`                         | Login        | User login form                  |
| `/logout`                        | Logout       | Logs out the current user        |
| `/categories/new`                | NewCategory  | Add a new category               |
| `/categories/:categoryId/plants` | UserCategory | Show plants in selected category |
| `/plants/new`                    | PlantForm    | Add a new plant                  |
| `/plants/:plantId`               | PlantDetails | View plant detail page           |
| `/care_notes/new`                | CareNoteForm | Add care note to a plant         |

🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss your proposed improvements.

📄 License
MIT License