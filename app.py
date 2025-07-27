from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv

# Naloži API ključ iz .env datoteke
load_dotenv()

# Inicializiraj OpenAI client (nova sintaksa)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Inicializiraj Flask app
app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/travel-plan", methods=["POST"])
def travel_plan():
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
    app.run(debug=True)
