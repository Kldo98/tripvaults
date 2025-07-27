# TripVaults Neoserv Deployment Guide

## 🚀 Deployment na Neoserv

### **Korak 1: Priprava datotek**

#### **Frontend datoteke (za Neoserv):**
```
public_html/
├── index.html
├── styles.css
├── script.js
├── README.md
└── favicon.ico (opcijsko)
```

#### **Backend datoteke (za Vercel):**
```
backend/
├── app.py
├── requirements.txt
├── vercel.json
└── .env (NE naložite v Git!)
```

### **Korak 2: GitHub Repository**

1. **Ustvarite GitHub repository:**
   ```bash
   git remote add origin https://github.com/your-username/tripvaults.git
   git push -u origin master
   ```

2. **Povežite z Neoserv:**
   - V Neoserv dashboard-u
   - Povežite GitHub repository
   - Nastavite auto-deploy

### **Korak 3: Backend Deployment (Vercel)**

1. **Ustvarite Vercel račun:** https://vercel.com
2. **Import GitHub repository**
3. **Nastavite environment variables:**
   - `OPENAI_API_KEY` = vaš OpenAI API ključ
4. **Deploy**
5. **Dobite URL:** `https://your-app.vercel.app`

### **Korak 4: Posodobite API URL**

V `script.js` zamenjajte:
```javascript
const apiUrl = 'https://your-app.vercel.app/api/travel-plan';
```

### **Korak 5: Neoserv Konfiguracija**

#### **A. Standard Hosting:**
1. **Naložite datoteke** preko File Manager
2. **Nastavite domene** v Neoserv dashboard-u
3. **Testirajte aplikacijo**

#### **B. VPS/Dedicated Server:**
1. **SSH dostop** na server
2. **Git clone** repository
3. **Nginx/Apache** konfiguracija
4. **SSL sertifikat** (Let's Encrypt)

### **Korak 6: Domain Setup**

#### **DNS Nastavitve:**
```
A Record: @ → Neoserv IP
CNAME: www → @
CNAME: api → Vercel URL (opcijsko)
```

#### **SSL Sertifikat:**
- **Neoserv avtomatsko** nastavi SSL
- **Let's Encrypt** za brezplačni SSL

## 🔧 Konfiguracija

### **Nginx Konfiguracija (če potrebujete):**
```nginx
server {
    listen 80;
    server_name tripvaults.com www.tripvaults.com;
    root /var/www/tripvaults/public_html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (opcijsko)
    location /api/ {
        proxy_pass https://your-app.vercel.app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### **Apache .htaccess (če potrebujete):**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]

# CORS headers
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type"
```

## 🔒 Varnost

### **Environment Variables:**
- **NE naložite** `.env` datoteke v Git
- **Uporabite** Neoserv environment variables
- **Vercel** environment variables za backend

### **CORS Nastavitve:**
```python
# V app.py
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["https://tripvaults.com", "https://www.tripvaults.com"])
```

## 📊 Monitoring

### **Neoserv Analytics:**
- **Traffic monitoring**
- **Error logs**
- **Performance metrics**

### **Vercel Analytics:**
- **API performance**
- **Response times**
- **Error tracking**

## 💰 Stroški

### **Neoserv:**
- **Standard hosting:** ~$5-15/mesec
- **VPS:** ~$20-50/mesec
- **Dedicated:** ~$100+/mesec

### **Vercel:**
- **Free tier:** 100GB/mesec
- **Pro:** $20/mesec

### **OpenAI:**
- **GPT-3.5-turbo:** ~$0.002/1K tokens
- **Ocena:** $5-20/mesec

## 🚀 Auto-Deploy Setup

### **GitHub Actions (opcijsko):**
```yaml
name: Deploy to Neoserv
on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Neoserv
      uses: appleboy/ssh-action@v0.1.4
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.KEY }}
        script: |
          cd /var/www/tripvaults
          git pull origin master
```

## 🔧 Troubleshooting

### **Pogosti problemi:**

1. **CORS napake:**
   - Preverite CORS nastavitve v Flask
   - Preverite domain v CORS origins

2. **API napake:**
   - Preverite Vercel logs
   - Preverite environment variables

3. **SSL napake:**
   - Preverite SSL sertifikat
   - Preverite DNS nastavitve

## 📞 Podpora

### **Neoserv Support:**
- **Ticket sistem** v dashboard-u
- **Live chat** (če na voljo)
- **Email podpora**

### **Vercel Support:**
- **Documentation:** https://vercel.com/docs
- **Community:** https://github.com/vercel/vercel/discussions

---

**TripVaults** - Ready for Neoserv! 🚀 