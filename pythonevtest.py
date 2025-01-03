from flask import Flask, request, render_template, Response, session
import requests
import json

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Required for using session

# Function to interact with the external chat model
def chat_with_model_stream(question, language):
    """Send a question to the external API and stream the response."""
    url = "http://localhost:11438/api/chat"

    # Initialize conversation history if not already in session
    if 'history' not in session:
        session['history'] = []
        
    # Add the new user question to the history
    session_history = session['history']
    session_history.append({"role": "user", "content": question})
    print(session_history)
    # Construct messages with history
    messages = [
    {"role": "system", "content": "You are an profissional assistant and chat client who answers general questions"},
] + session_history 

    # Payload for the API request
    payload = {
        "model": "llama3",
        "messages": messages
    }

    headers = {"Content-Type": "application/json"}

    try:
        # Send POST request with streaming enabled
        response = requests.post(url, data=json.dumps(payload), headers=headers, stream=True)

        if response.status_code == 200:
            def generate(history):
                for chunk in response.iter_lines(decode_unicode=True):
                    if chunk:
                        try:
                            # Parse each line of the response as JSON
                            data = json.loads(chunk)
                            if "message" in data and "content" in data["message"]:
                                content = data["message"]["content"]
                                # Update the session history after the generator is done
                                history.append({"role": "assistant", "content": content})
                                yield content
                        except json.JSONDecodeError:
                            # Handle non-JSON chunks
                            yield "Non-JSON data received\n"

            # Use a local copy of history to avoid request context issues
            return Response(generate(session_history), content_type="text/plain")
        else:
            # Handle non-200 HTTP responses
            return Response(f"Error: Received status code {response.status_code}", content_type="text/plain")

    except requests.RequestException as e:
        # Handle request exceptions
        return Response(f"Request failed: {str(e)}", content_type="text/plain")


# Route for the main page
@app.route("/", methods=["GET", "POST"])
def index():
    
    if request.method == "POST":
        question = request.form.get("question")
        language = request.form.get("language")
        if question:
            # Stream the response directly to the client
            return chat_with_model_stream(question, language)
    return render_template("index.html")

# Route to clear the chat history
@app.route("/clear", methods=["GET"])
def clear_history():
    session.pop('history', None)  # Remove history from the session
    return "History cleared!", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

