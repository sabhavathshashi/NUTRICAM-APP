# 🥗 Nutricam - AI-Powered Nutrition Tracking App

A full-stack nutrition tracking application that uses AI to identify food from images and provide detailed nutritional information.

## ✨ Features

- 📸 **Real-time Camera Feed** - Capture food images directly from your device
- 🤖 **AI Food Recognition** - Automatic food identification using ML models
- 📊 **Nutrition Analysis** - Detailed breakdown of calories, macros, and micronutrients
- 📝 **Food Logging** - Track your daily food intake
- 📈 **Daily Summaries** - View your nutritional progress
- 🔐 **User Authentication** - Secure login and registration
- 🎨 **Premium UI** - Modern, dark-themed interface with glassmorphism

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development
- **CSS3** with custom design system
- Modern glassmorphism UI

### Backend
- **FastAPI** (Python)
- **SQLAlchemy** ORM
- **SQLite** database
- **JWT** authentication
- **TensorFlow/PyTorch** ready for ML models

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd "d:\NUTRICAM\NUTRICAM  MAIN"
```

2. **Backend Setup**
```bash
cd backend

# Create virtual environment (if not exists)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

3. **Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install
```

### Running the Application

1. **Start the Backend Server**
```bash
cd backend
python run.py
```
Backend will run on `http://localhost:8000`

2. **Start the Frontend Development Server**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

## 📖 Usage

1. **Sign Up / Login** - Create an account or login
2. **Scan Food** - Use the camera to capture food images
3. **View Results** - See AI-predicted food item with nutrition info
4. **Save to Log** - Add the food to your daily log
5. **View History** - Check your daily nutrition summary and food logs

## 🔧 Configuration

### Backend Configuration
Edit `backend/.env`:
```env
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///./nutricam.db
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend Configuration
Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
```

## 🤖 ML Model Integration

The current implementation uses a **mock food classifier** for demonstration. To integrate a real ML model:

1. Train or download a food classification model (TensorFlow/PyTorch)
2. Save the model to `backend/app/models/`
3. Update `backend/app/models/food_classifier.py` to load and use your model
4. Replace the mock `predict()` method with actual model inference

Example models you can use:
- **Food-101** dataset models
- **YOLOv8** for food detection
- **EfficientNet** for classification
- **Vision Transformers** (ViT)

## 📁 Project Structure

```
NUTRICAM MAIN/
├── backend/
│   ├── app/
│   │   ├── database/       # Database models and nutrition data
│   │   ├── models/         # ML model wrapper
│   │   ├── routes/         # API endpoints
│   │   ├── auth.py         # Authentication utilities
│   │   ├── schemas.py      # Pydantic schemas
│   │   └── main.py         # FastAPI app
│   ├── requirements.txt
│   ├── .env
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx         # Main app component
│   │   └── index.css       # Design system
│   ├── package.json
│   └── .env
└── README.md
```

## 🎨 Design System

The app features a premium dark theme with:
- **Glassmorphism** effects
- **Vibrant gradients**
- **Smooth animations**
- **Responsive design**
- **Custom color palette**

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation with Pydantic

## 🚀 Deployment

### Backend Deployment
- Deploy to **Heroku**, **Railway**, or **AWS**
- Use **PostgreSQL** for production database
- Set environment variables

### Frontend Deployment
- Deploy to **Vercel**, **Netlify**, or **AWS S3**
- Update `VITE_API_URL` to production backend URL

## 📝 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize!

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by nutrition tracking apps like MyFitnessPal
- AI-powered food recognition concept

---

**Made with ❤️ using AI**
