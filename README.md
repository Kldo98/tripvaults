# TripVaults - Your AI Guide for Carefree Travel

A modern travel planning website that uses artificial intelligence to create personalized travel plans. Built with HTML5, CSS3, JavaScript, and Flask backend with OpenAI integration.

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- Node.js (optional, for local development server)
- OpenAI API key

### Backend Setup (Flask API)

1. **Navigate to your Flask backend directory:**
   ```bash
   cd path/to/your/flask/backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the Flask backend:**
   ```bash
   python app.py
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Open the website:**
   - Simply open `index.html` in your browser, or
   - Use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve .
     ```

2. **Access the website:**
   - Open `http://localhost:8000` (or whatever port you chose)

## 🔧 How It Works

### Frontend (HTML/CSS/JS)
- **Modern responsive design** with dark gold theme
- **Interactive form** for travel preferences
- **Real-time API communication** with Flask backend
- **PDF generation** for travel plans
- **Smooth animations** and user experience

### Backend (Flask + OpenAI)
- **Flask API** handling travel plan requests
- **OpenAI GPT integration** for intelligent planning
- **CORS enabled** for local development
- **Environment-based configuration**

## 📁 Project Structure

```
tripvaults/
├── index.html          # Main website
├── styles.css          # Styling
├── script.js           # Frontend JavaScript
├── README.md           # This file
└── backend/            # Flask backend (separate directory)
    ├── app.py          # Flask application
    ├── requirements.txt # Python dependencies
    └── .env            # Environment variables
```

## 🌟 Features

### 🎨 Design
- **Dark gold theme** - Elegant and luxurious look
- **Travel fonts** - Playfair Display for headings, Inter for text
- **Responsive design** - Fully adapted for all devices
- **Smooth animations** - JavaScript animations for better user experience

### 🤖 AI Travel Planner
- **Intelligent planning** - AI creates perfect travel plans
- **Personalized preferences** - Choice of interests and budget
- **Real-time generation** - Instant AI responses
- **PDF export** - Download travel plans as PDF
- **Hidden gems** - Hidden locations away from tourists
- **Photo spots** - Best points for photography

### 📱 User Experience
- **Interactive form** - Easy preference selection
- **Loading animations** - Visual feedback during AI processing
- **Error handling** - Graceful fallbacks and user notifications
- **Mobile responsive** - Works perfectly on all devices

## 🔌 API Integration

The frontend communicates with the Flask backend via:

```javascript
// Local development
const apiUrl = 'http://localhost:5000/api/travel-plan';

// Production
const apiUrl = '/api/travel-plan';
```

### API Request Format:
```json
{
  "destination": "Paris, France",
  "people": "2",
  "interests": ["culture", "food", "adventure"],
  "groupType": "couple",
  "startDate": "2024-06-01",
  "endDate": "2024-06-05",
  "budget": "mid"
}
```

### API Response Format:
```json
{
  "plan": "**Day 1:**\n\n*Morning:*\n- Start your day with..."
}
```

## 🛠️ Development

### Local Development Setup

1. **Start Flask backend:**
   ```bash
   cd backend
   python app.py
   ```

2. **Start frontend server:**
   ```bash
   python -m http.server 8000
   ```

3. **Access the application:**
   - Frontend: `http://localhost:8000`
   - Backend API: `http://localhost:5000`

### Debugging

- **Frontend console:** Check browser developer tools for JavaScript errors
- **Backend logs:** Check terminal where Flask is running
- **API calls:** Monitor network tab in browser developer tools

## 🚀 Deployment

### Production Setup

1. **Backend deployment:**
   - Deploy Flask app to your server
   - Set up Gunicorn or similar WSGI server
   - Configure environment variables

2. **Frontend deployment:**
   - Upload HTML, CSS, JS files to your web server
   - Update API URL to production endpoint
   - Configure CORS if needed

### Environment Variables

```bash
# Backend (.env)
OPENAI_API_KEY=your_openai_api_key_here
FLASK_ENV=production
```

## 🔮 Future Features

- [ ] **User accounts** - Save and manage travel plans
- [ ] **Booking integration** - Direct links to booking platforms
- [ ] **Real-time weather** - Weather integration for planning
- [ ] **Social sharing** - Share plans on social media
- [ ] **Mobile app** - Native mobile application
- [ ] **Voice interface** - Voice-activated travel planning
- [ ] **Group planning** - Collaborative travel planning
- [ ] **Budget tracking** - Real-time budget management

## 📞 Support

For issues or questions:
- Check the console logs for error messages
- Ensure both frontend and backend are running
- Verify API key is correctly set in `.env`
- Check network connectivity and CORS settings

## 📄 License

This project is for educational and personal use. Please respect OpenAI's terms of service when using their API.

---

**TripVaults** - Your AI Guide for Carefree Travel ✈️ 