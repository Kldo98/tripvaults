from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv

# Naloži API ključ iz .env datoteke
load_dotenv()

# Inicializiraj OpenAI client (nova sintaksa)
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("Warning: OPENAI_API_KEY not set. API calls will fail.")
    client = None
else:
    client = OpenAI(api_key=api_key)

# Inicializiraj Flask app
app = Flask(__name__)
CORS(app)

@app.route("/")
def health_check():
    if client:
        return jsonify({"status": "TripVaults API is running!", "message": "Backend is ready", "api_key": "set"})
    else:
        return jsonify({"status": "TripVaults API is running!", "message": "Backend is ready", "api_key": "not_set"})

@app.route("/api/travel-plan", methods=["POST"])
def travel_plan():
    if not client:
        return jsonify({"error": "OpenAI API key not configured"}), 500
    
    data = request.json
    destination = data.get("destination")
    people = data.get("people")
    interests = data.get("interests")

    if not (destination and people and interests):
        return jsonify({"error": "Manjkajo podatki"}), 400

    prompt = f"""
    Ustvari 5-dnevni potovalni plan za {people} oseb, ki potujejo v {destination}. 
    Njihovi interesi so: {', '.join(interests)}. 
    Vsak dan naj bo razdeljen na jutro, popoldne in večer.
    Vključi hidden gems, lokalne nasvete, in če je mogoče tudi linke.
    """

    # Nova metoda v novi verziji knjižnice
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Ti si TripVaults potovalni planer."},
            {"role": "user", "content": prompt}
        ]
    )

    plan = response.choices[0].message.content
    return jsonify({"plan": plan})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
