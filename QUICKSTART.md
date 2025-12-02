# 🚀 Quick Start Guide

## First Time Setup

### 1. Install Backend Dependencies
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 2. Install Frontend Dependencies
```powershell
cd frontend
npm install
```

## Running the Application

### Option 1: Manual Start (Recommended for first time)

**Terminal 1 - Backend:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python run.py
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Option 2: Automated Start
```powershell
.\start.ps1
```

## Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## First Steps

1. Open http://localhost:5173 in your browser
2. Click "Sign Up" to create an account
3. Login with your credentials
4. Click "Scan Food" tab
5. Allow camera permissions
6. Point camera at food and click "Capture & Analyze"
7. View nutrition results and save to your log
8. Check "History" tab to see your daily summary

## Troubleshooting

### Backend Issues
- Make sure Python 3.8+ is installed
- Activate virtual environment before running
- Check if port 8000 is available

### Frontend Issues
- Make sure Node.js 16+ is installed
- Run `npm install` if packages are missing
- Check if port 5173 is available

### Camera Issues
- Allow camera permissions in browser
- Use HTTPS or localhost (required for camera access)
- Try switching cameras with the 🔄 button

## Default Test Account (Optional)

You can create any account you want. Example:
- Username: `testuser`
- Email: `test@example.com`
- Password: `password123`

---

**Enjoy tracking your nutrition! 🥗**
