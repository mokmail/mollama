from flask import Flask, request, jsonify, session, Response, stream_with_context
from flask_session import Session
import requests
import json
from flask_cors import CORS


app = Flask(__name__)
# app.config['SESSION_TYPE'] = 'filesystem'
# app.config['SESSION_COOKIE_HTTPONLY'] = True
# app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # Allow cross-origin cookies
# app.config['SESSION_COOKIE_SECURE'] = True      # Use Secure cookies (requires HTTPS)

# Session(app)
# app.secret_key = "history"
CORS(app ,  supports_credentials=True)
# Function to interact with the model

history =[]

def checkhistory():
    global history
    if len(history) > 0:
        return history
    else:
        return []
   
        

@app.route("/chat", methods=["POST"])
def chat_with_model():
    global history
    history = checkhistory()
    data = request.json
    question = data.get("question")

    if not question:
        return jsonify({"error": "Question is required"}), 400

    # Initialize session history if not present

   
    # Add the user's question to the session history
    session_history = history
    
    session_history.append({"role": "user", "content": question})
    history = session_history  # Update the session with the new history
    
    # Construct messages with history
    messages = [
        {"role": "system", "content": "You are a professional assistant and chat client who answers general questions"},
    ] + session_history

    # Payload for the API request
    payload = {
        "model": "llama3.2",
        "messages": messages
    }

    headers = {"Content-Type": "application/json"}

    def generate_response(history):
        try:
            # Send POST request to the model API
            url = "http://localhost:11438/api/chat"  # Replace with your API endpoint
            with requests.post(url, data=json.dumps(payload), headers=headers, stream=True) as response:
                temp_content= ""
                if response.status_code == 200:
                    for chunk in response.iter_lines(decode_unicode=True):
                        if chunk:
                            # Parse each line of the response as JSON
                            data = json.loads(chunk)
                            if "message" in data and "content" in data["message"]:
                                content = data["message"]["content"]
                                # Add the assistant's response to the session history
                                temp_content += content
                                yield content 
                                
                    history.append({"role": "assistant", "content": temp_content})
                    print(history)
                    return history
                                #session['history'] = session_history  # Update the session
                        
                else:
                    yield json.dumps({"error": f"Model API error: {response.status_code}"}) + "\n"
        except requests.RequestException as e:
            yield json.dumps({"error": f"Request failed: {str(e)}"}) + "\n"

    # Stream the response using Flask's Response object
    return Response(stream_with_context(generate_response(session_history)), content_type="application/json")

# Route to clear the chat history
@app.route("/clear", methods=["GET"])
def clear_history():
    global history
    history=[]
    # Remove history from the session
    return jsonify({"message": f"History cleared! {history}"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
