import os
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv

load_dotenv()
HF_API_KEY = os.getenv("HF_API_KEY")

app = Flask(__name__)

@app.route('/')
def home():
    return 'Krida ML API'

@app.route('/pose', methods=['POST'])
def pose_estimation():
    # Dummy response
    return jsonify({'pose': 'standing', 'confidence': 0.95})

@app.route('/recommend', methods=['POST'])
def recommend():
    # Dummy response
    return jsonify({'recommendation': 'Run 5km daily'})

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')
    # Dummy response
    return jsonify({'response': f'You said: {user_message}'})

@app.route('/hf-generate', methods=['POST'])
def hf_generate():
    user_message = request.json.get('message', '')
    headers = {
        "Authorization": f"Bearer {HF_API_KEY}"
    }
    payload = {
        "inputs": user_message,
        "parameters": {"max_new_tokens": 50}
    }
    response = requests.post(
        "https://api-inference.huggingface.co/models/google/flan-t5-small",
        headers=headers,
        json=payload
    )
    if response.status_code == 200:
        result = response.json()
        output = result[0]['generated_text'] if isinstance(result, list) else result
        return jsonify({'response': output})
    else:
        return jsonify({'error': response.text}), response.status_code

if __name__ == '__main__':
    app.run(port=5000) 