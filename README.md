# TripVaults - Your AI Guide for Carefree Travel

## 🚀 Quick Start

### Local Development

1. **Start Flask Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```
   ✅ Backend runs on `http://localhost:5000`

2. **Start Frontend:**
   ```bash
   python -m http.server 8000
   ```
   ✅ Frontend runs on `http://localhost:8000`

3. **Test the Application:**
   - Open `http://localhost:8000`
   - Fill out the travel form
   - Test AI travel plan generation

## 🏗️ How It Works

### Frontend (HTML/CSS/JS)
- **index.html:** Main website structure
- **styles.css:** Dark gold theme, responsive design
- **script.js:** AI planner, API integration, PDF generation

### Backend (Flask/OpenAI)
- **app.py:** Flask server with OpenAI integration
- **requirements.txt:** Python dependencies
- **vercel.json:** Vercel deployment configuration

## 📁 Project Structure

```
tripvaults/
├── index.html          # Frontend (Neoserv)
├── styles.css          # Frontend styling
├── script.js           # Frontend JavaScript
├── README.md           # Documentation
├── SETUP.md            # Local setup guide
├── DEPLOYMENT.md       # Production deployment
├── DEPLOYMENT-NEOSERV.md # Neoserv specific guide
├── vercel.json         # Vercel config
├── requirements.txt    # Python dependencies
├── app.py             # Flask backend (Vercel)
└── .env               # Environment variables (local only)
```

## ✨ Features

### 🧠 AI Travel Planning
- **Personalized plans** based on preferences
- **Group-specific** recommendations
- **Budget optimization** suggestions
- **Hidden gems** discovery
- **Photo spots** recommendations

### 🎨 Modern Design
- **Dark gold theme** with gradients
- **Responsive layout** for all devices
- **Smooth animations** and transitions
- **Interactive elements** with hover effects

### 📱 User Experience
- **Intuitive form** with visual options
- **Real-time validation** and feedback
- **PDF generation** for travel plans
- **Share functionality** for plans

### 🔧 Technical Features
- **OpenAI API integration** for AI responses
- **Flask backend** for API handling
- **CORS support** for cross-origin requests
- **Environment-based** configuration
- **Error handling** with fallbacks

## 🌐 API Integration

### Request Format
```json
{
  "destination": "Paris",
  "people": "2",
  "interests": ["culture", "food"],
  "groupType": "couple",
  "startDate": "2024-06-01",
  "endDate": "2024-06-05",
  "budget": "mid"
}
```

### Response Format
```json
{
  "plan": "**Day 1:**\n*Morning:* Start your day...",
  "error": null
}
```

## 🚀 Development

### Local Testing
- **Test mode** available when backend not running
- **Simulated AI responses** for development
- **Console logging** for debugging

### Production Deployment
- **Frontend:** Neoserv hosting
- **Backend:** Vercel serverless functions
- **Domain:** Custom domain configuration
- **SSL:** Automatic SSL certificates

## 🔒 Security

### Environment Variables
- **OPENAI_API_KEY:** Your OpenAI API key
- **CORS_ORIGINS:** Allowed domains
- **FLASK_ENV:** Environment setting

### Best Practices
- **API keys** never committed to Git
- **CORS** properly configured
- **Input validation** on all forms
- **Error handling** for all API calls

## 💰 Cost Estimation

### Monthly Costs
- **Neoserv Hosting:** ~$5-15/month
- **Vercel Backend:** Free tier (100GB)
- **OpenAI API:** ~$5-20/month
- **Domain:** ~$10-15/year

## 🔮 Future Features

### Planned Enhancements
- **Multi-language support**
- **Advanced AI models** (GPT-4)
- **Image generation** for destinations
- **Real-time booking** integration
- **Social sharing** features
- **Mobile app** development

### Technical Improvements
- **Caching** for API responses
- **Rate limiting** implementation
- **Advanced analytics** tracking
- **A/B testing** capabilities

## 📞 Support

### Documentation
- **SETUP.md:** Local development guide
- **DEPLOYMENT.md:** Production deployment
- **DEPLOYMENT-NEOSERV.md:** Neoserv specific guide

### Troubleshooting
- **Console logs** for debugging
- **Network tab** for API issues
- **Environment variables** verification
- **CORS configuration** checks

---

**TripVaults** - Your AI Guide for Carefree Travel ✈️

*Last updated: December 2024* 