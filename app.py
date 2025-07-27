from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

# Naloži API ključ iz .env datoteke
load_dotenv()

# Inicializiraj OpenAI client (stara sintaksa)
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("Warning: OPENAI_API_KEY not set. API calls will fail.")
    client = None
else:
    openai.api_key = api_key

# Inicializiraj Flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:8000", "http://localhost:3000", "http://127.0.0.1:8000", "http://127.0.0.1:3000", "*"])

@app.route("/")
def health_check():
    if api_key:
        return jsonify({"status": "TripVaults API is running!", "message": "Backend is ready", "api_key": "set"})
    else:
        return jsonify({"status": "TripVaults API is running!", "message": "Backend is ready", "api_key": "not_set"})

@app.route("/api/travel-plan", methods=["OPTIONS"])
def travel_plan_options():
    response_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }
    return "", 200, response_headers

@app.route("/api/travel-plan", methods=["POST"])
def travel_plan():
    # Add CORS headers
    response_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }
    
    if not api_key:
        return jsonify({"error": "OpenAI API key not configured"}), 500, response_headers
    
    data = request.json
    destination = data.get("destination")
    people = data.get("people")
    interests = data.get("interests")
    groupType = data.get("groupType", "travelers")
    startDate = data.get("startDate", "")
    endDate = data.get("endDate", "")
    budget = data.get("budget", "mid")
    language = data.get("language", "English")

    if not (destination and people and interests and language):
        return jsonify({"error": "Missing required data"}), 400

    # Calculate trip duration
    days = 5
    if startDate and endDate:
        try:
            from datetime import datetime
            start = datetime.strptime(startDate, "%Y-%m-%d")
            end = datetime.strptime(endDate, "%Y-%m-%d")
            days = (end - start).days
            if days <= 0:
                days = 5
        except:
            days = 5

    budget_text = {
        "budget": "budget-friendly",
        "mid": "mid-range",
        "luxury": "luxury"
    }.get(budget, "mid-range")

    prompt = f"""
Ustvari ekskluziven, personaliziran in podroben {days}-dnevni potovalni vodič za {people} osebo/oseb, ki potuje v {destination}.
Celoten vodič naj bo napisan v jeziku: **{language}** (izbran s strani uporabnika).

🟢 Interesi potnikov: {', '.join(interests)}.

🎯 Navodila:
- Vključuj **overview** destinacije (kulturni značaj, občutek kraja).
- Na začetku napiši tudi **"Suggested Stay"** – koliko dni priporočaš za to destinacijo.
- Vsak dan razdeli na: **Morning**, **Afternoon**, **Evening**.
- Aktivnosti naj bodo usklajene z interesi uporabnika.
- Označi vsak dan z "tipom dneva" (npr. kulturni, naravni, kulinarični, družinski).
- Za vsak del dneva predlagaj konkretne aktivnosti z opisom **kaj, zakaj in kdaj iti**.

🍽️ Vključuj vsak dan:
- 1 lokalno restavracijo in 1 fine dining restavracijo z:
    - imenom,
    - točnim naslovom,
    - Google oceno (če obstaja),
    - opisom + vsaj 1 must-try jedjo.

📍 Vsak dan naj vsebuje:
- vsaj en **hidden gem** (s podrobnim opisom zgodbe ali posebnosti),
- **lokalne nasvete** (kdaj iti, kako se izogniti množici, lokalni bonton).

🌙 Vključuj **večerne aktivnosti**, kot so:
- lokalne predstave, panoramske točke, rooftop bari, cruise izleti ipd.

📱 Na koncu vodiča dodaj sekcijo:
**Recommended Apps for {destination}** – 4–6 koristnih aplikacij (lokalni prevozi, navigacija, hrana, valutni pretvornik, ipd.).

🍛 Dodaj še sekcijo:
**Must-Try Local Foods in {destination}** – 5 najbolj značilnih jedi kraja z opisi.

🗣️ Na koncu dodaj sekcijo:
**Useful Local Phrases** – fraze v lokalnem jeziku destinacije s prevodi v {language}.
Naj jih bo vsaj 5–10 (npr. pozdrav, zahvala, naročilo hrane, vprašanje za pot…).

✍️ Slog pisanja:
- Topel, profesionalen in navdihujoč – kot da vodič piše lokalni poznavalec.
- Vključi opise občutkov, ambientov in posebnosti – naj bo vodnik doživetje, ne le seznam.
- Ne ponavljaj aktivnosti med dnevi.
- Naj vodič odraža **TripVaults** vrednote: globlja izkušnja, lokalno, unikatno, pametno raziskovanje.

Cilj: Uporabniku omogoči nepozabno, avtentično in elegantno potovanje.
"""

    # Stara metoda v stari verziji knjižnice
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are TripVaults travel planner, an expert in creating comprehensive, personalized travel guides. You have deep knowledge of destinations worldwide, local cultures, hidden gems, and authentic experiences. Create detailed, engaging travel guides in the requested language that provide genuine local insights and unforgettable experiences. Focus on quality over quantity, ensuring each recommendation is carefully curated and valuable."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=4000,
        temperature=0.7
    )

    plan = response.choices[0].message.content
    return jsonify({"plan": plan}), 200, response_headers

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
