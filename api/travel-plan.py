from openai import OpenAI
import os
import json

# Inicializiraj OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def handler(request, context):
    # Preveri, ali je POST request
    if request.method != "POST":
        return {
            "statusCode": 405,
            "body": json.dumps({"error": "Method not allowed"})
        }
    
    try:
        # Preberi JSON data
        data = json.loads(request.body)
        destination = data.get("destination")
        people = data.get("people")
        interests = data.get("interests")

        if not (destination and people and interests):
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Manjkajo podatki"})
            }

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
        
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "body": json.dumps({"plan": plan})
        }
        
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        } 