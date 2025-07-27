# TripVaults Setup Guide

## 🚀 Quick Setup for Local Development

### Step 1: Start the Flask Backend

1. **Navigate to your Flask backend directory** (where your `app.py` is located)
2. **Install dependencies:**
   ```bash
   pip install flask python-dotenv openai
   ```
3. **Create `.env` file** with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. **Start the Flask server:**
   ```bash
   python app.py
   ```
   ✅ Backend will run on `http://localhost:5000`

### Step 2: Start the Frontend

1. **Open a new terminal** (keep the Flask server running)
2. **Navigate to this directory** (where `index.html` is located)
3. **Start a local server:**
   ```bash
   python -m http.server 8000
   ```
   ✅ Frontend will run on `http://localhost:8000`

### Step 3: Test the Application

1. **Open your browser** and go to `http://localhost:8000`
2. **Fill out the travel form** with your preferences
3. **Click "Create My AI Travel Plan"**
4. **Check the browser console** (F12) for any error messages

## 🔧 Troubleshooting

### If you get "AI service temporarily unavailable":

1. **Check if Flask backend is running:**
   - Open `http://localhost:5000` in browser
   - Should see Flask welcome page

2. **Check console logs:**
   - Press F12 in browser
   - Go to Console tab
   - Look for error messages

3. **Common issues:**
   - **CORS error:** Backend needs CORS headers
   - **Connection refused:** Flask not running on port 5000
   - **API key error:** Check your `.env` file

### If Flask backend won't start:

1. **Check Python version:**
   ```bash
   python --version
   ```
   Should be 3.7 or higher

2. **Check dependencies:**
   ```bash
   pip list | grep flask
   pip list | grep openai
   ```

3. **Check port 5000:**
   ```bash
   netstat -an | grep 5000
   ```
   Port should be free

## 📁 File Structure

```
tripvaults/
├── index.html          # Frontend (this file)
├── styles.css          # Frontend styling
├── script.js           # Frontend JavaScript
├── README.md           # Documentation
├── SETUP.md            # This file
└── backend/            # Your Flask backend
    ├── app.py          # Flask application
    ├── requirements.txt # Python dependencies
    └── .env            # Environment variables
```

## 🌐 Access URLs

- **Frontend:** `http://localhost:8000`
- **Backend API:** `http://localhost:5000`
- **API Endpoint:** `http://localhost:5000/api/travel-plan`

## ✅ Success Indicators

When everything is working correctly:

1. **Frontend loads** without errors
2. **Form is interactive** and responsive
3. **API calls succeed** (check Network tab in browser dev tools)
4. **AI responses appear** in the result section
5. **PDF download works** when clicking "Download PDF"

## 🆘 Need Help?

1. **Check browser console** for JavaScript errors
2. **Check Flask terminal** for Python errors
3. **Verify API key** is correct in `.env`
4. **Ensure both servers** are running simultaneously

---

**TripVaults** - Your AI Guide for Carefree Travel ✈️ 