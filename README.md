# Daily Log Chronicles

A full-stack web application for creating, reading, updating, and deleting daily blog entries. Built with a FastAPI backend, a React frontend, and a PostgreSQL database hosted on Neon.

## 🚀 Tech Stack

**Frontend:**
* React (Create React App)
* Pure Vanilla CSS (Responsive Grid Layout)

**Backend:**
* Python
* FastAPI
* SQLAlchemy (ORM)
* PostgreSQL (via Neon)

## 📁 Project Structure

```text
blog-app/
├── backend/
│   ├── main.py              # FastAPI application and routes
│   └── requirements.txt     # Python dependencies
└── frontend/
    ├── public/
    │   └── index.html       # HTML root
    ├── src/
    │   ├── components/      # React components (BlogForm, BlogCard, Pagination)
    │   ├── App.js           # Main React application logic
    │   ├── index.js         # React DOM rendering
    │   └── styles.css       # Vanilla CSS styles
    └── package.json         # Node.js dependencies


    cd backend

# (Optional) Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Export your database URL
export DATABASE_URL="your-neon-database-url" # On Windows (CMD): set DATABASE_URL="your-neon-database-url"

# Run the FastAPI server
uvicorn main:app --reload

cd frontend

# Install Node dependencies
npm install

# Start the React development server
npm start