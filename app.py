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
CORS(app)

@app.route("/")
def health_check():
    if api_key:
        return jsonify({"status": "TripVaults API is running!", "message": "Backend is ready", "api_key": "set"})
    else:
        return jsonify({"status": "TripVaults API is running!", "message": "Backend is ready", "api_key": "not_set"})

@app.route("/api/travel-plan", methods=["POST"])
def travel_plan():
    if not api_key:
        return jsonify({"error": "OpenAI API key not configured"}), 500
    
    data = request.json
    destination = data.get("destination")
    people = data.get("people")
    interests = data.get("interests")
    groupType = data.get("groupType", "travelers")
    startDate = data.get("startDate", "")
    endDate = data.get("endDate", "")
    budget = data.get("budget", "mid")

    if not (destination and people and interests):
        return jsonify({"error": "Missing required data"}), 400

    # Calculate trip duration
    duration_text = ""
    if startDate and endDate:
        try:
            from datetime import datetime
            start = datetime.strptime(startDate, "%Y-%m-%d")
            end = datetime.strptime(endDate, "%Y-%m-%d")
            days = (end - start).days
            duration_text = f" for {days} days"
        except:
            duration_text = " for 5 days"
    else:
        duration_text = " for 5 days"

    budget_text = {
        "budget": "budget-friendly",
        "mid": "mid-range",
        "luxury": "luxury"
    }.get(budget, "mid-range")

    prompt = f"""
    Create a detailed travel plan{duration_text} for {people} {groupType} traveling to {destination}.
    
    Travel preferences:
    - Interests: {', '.join(interests)}
    - Budget level: {budget_text}
    - Group type: {groupType}
    
    Please provide a comprehensive travel plan that includes:
    1. Daily schedule (morning, afternoon, evening)
    2. Recommended activities based on their interests
    3. Hidden gems and local recommendations
    4. Restaurant and dining suggestions
    5. Transportation tips
    6. Accommodation recommendations
    7. Photo opportunities
    8. Booking links where applicable
    
    Format the response with clear day-by-day structure using markdown formatting:
    **Day 1:**
    *Morning:*
    - Activity 1
    - Activity 2
    *Afternoon:*
    - Activity 1
    - Activity 2
    *Evening:*
    - Activity 1
    - Activity 2
    
    Make it engaging and personalized for their interests and budget level.
    """

    # Stara metoda v stari verziji knjižnice
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are TripVaults travel planner. Create detailed, personalized travel plans in English with clear day-by-day structure."},
            {"role": "user", "content": prompt}
        ]
    )

    plan = response.choices[0].message.content
    return jsonify({"plan": plan})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
