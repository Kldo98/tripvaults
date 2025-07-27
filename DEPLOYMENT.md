# TripVaults Production Deployment Guide

## 🚀 Deployment Strategy

Since Domenica doesn't support Python/Flask directly, we'll use a **hybrid approach**:
- **Frontend:** Domenica (HTML/CSS/JS)
- **Backend:** Vercel/Railway/Render (Flask API)

## 📋 Step-by-Step Deployment

### **Step 1: Deploy Backend to Vercel**

#### **Option A: Vercel (Recommended)**

1. **Create Vercel account:** https://vercel.com
2. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Prepare backend files:**
   ```
   backend/
   ├── app.py
   ├── requirements.txt
   ├── vercel.json
   └── .env (with your OpenAI API key)
   ```

4. **Deploy to Vercel:**
   ```bash
   cd backend
   vercel
   ```

5. **Set environment variables in Vercel dashboard:**
   - `OPENAI_API_KEY` = your OpenAI API key

6. **Get your API URL:** `https://your-app.vercel.app`

#### **Option B: Railway**

1. **Create Railway account:** https://railway.app
2. **Connect your GitHub repository**
3. **Add environment variables:**
   - `OPENAI_API_KEY`
4. **Deploy automatically**

#### **Option C: Render**

1. **Create Render account:** https://render.com
2. **Create new Web Service**
3. **Connect your repository**
4. **Set environment variables**
5. **Deploy**

### **Step 2: Update Frontend API URL**

Once you have your backend URL, update the JavaScript:

```javascript
// In script.js, change this line:
const apiUrl = 'https://your-app.vercel.app/api/travel-plan';
```

### **Step 3: Deploy Frontend to Domenica**

1. **Upload files to Domenica:**
   - `index.html`
   - `styles.css`
   - `script.js` (with updated API URL)
   - `README.md`

2. **Test the application:**
   - Visit your domain
   - Test the travel planner
   - Verify API calls work

## 🔧 Configuration Files

### **vercel.json** (for Vercel deployment)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "app.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "app.py"
    }
  ],
  "env": {
    "OPENAI_API_KEY": "@openai_api_key"
  }
}
```

### **requirements.txt**
```
flask==2.3.3
python-dotenv==1.0.0
openai==1.3.0
flask-cors==4.0.0
```

### **Updated app.py** (for production)
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import openai

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/api/travel-plan', methods=['POST'])
def generate_travel_plan():
    try:
        data = request.json
        
        # Your existing GPT logic here
        # ...
        
        return jsonify({'plan': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False)
```

## 🌐 Domain Configuration

### **Option 1: Custom Domain on Vercel**
1. **Add custom domain in Vercel dashboard**
2. **Update DNS records**
3. **Use custom domain for API calls**

### **Option 2: Subdomain**
- **Frontend:** `tripvaults.com`
- **Backend:** `api.tripvaults.com`

## 🔒 Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files
   - Use platform environment variables

2. **CORS Configuration:**
   - Limit CORS to your domain only
   - Update in production

3. **API Rate Limiting:**
   - Consider adding rate limiting
   - Monitor API usage

## 📊 Monitoring

1. **Vercel Analytics:** Monitor API performance
2. **OpenAI Usage:** Track API costs
3. **Error Logging:** Set up error monitoring

## 🚀 Alternative: Serverless Functions

If you prefer, you can also use:
- **Netlify Functions**
- **AWS Lambda**
- **Google Cloud Functions**

## 💰 Cost Estimation

### **Vercel (Backend):**
- **Free tier:** 100GB bandwidth/month
- **Pro:** $20/month for more usage

### **Domenica (Frontend):**
- **Standard hosting:** ~$5-10/month

### **OpenAI API:**
- **GPT-3.5-turbo:** ~$0.002 per 1K tokens
- **Estimated cost:** $5-20/month depending on usage

## 🔧 Troubleshooting

### **Common Issues:**

1. **CORS Errors:**
   - Check CORS configuration in Flask
   - Verify domain in CORS settings

2. **API Key Issues:**
   - Verify environment variables are set
   - Check API key format

3. **Deployment Issues:**
   - Check Vercel logs
   - Verify requirements.txt

## 📞 Support

For deployment issues:
1. Check Vercel/Railway/Render logs
2. Verify environment variables
3. Test API endpoints separately
4. Monitor browser console for errors

---

**TripVaults** - Production Ready! 🚀 