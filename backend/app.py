# import os
# import requests
# import time
# from dotenv import load_dotenv
# from flask import Flask, jsonify, request
# from flask_cors import CORS

# # ---------------------------
# # INITIAL SETUP
# # ---------------------------
# # Load environment variables from a .env file
# load_dotenv()

# # Initialize Flask app
# app = Flask(__name__)

# # ✅ Enabled CORS to allow requests from your React frontend
# CORS(app)

# # ---------------------------
# # CONFIGURATION
# # ---------------------------
# # Get your Hugging Face API token securely from the .env file
# HF_API_TOKEN = os.getenv("HF_API_TOKEN")
# API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"

# # ---------------------------
# # HELPER FUNCTIONS
# # ---------------------------
# def refine_prompt(prompt: str) -> str:
#     """
#     Refines the user's prompt by adding style keywords for better image quality.
#     """
#     enhancements = "4k, 8k, photorealistic, ultra detailed, masterpiece, professional lighting, vibrant colors"
#     return f"{prompt}, {enhancements}"

# def query_api(payload):
#     """
#     Sends a request to the Hugging Face API and returns the image bytes.
#     """
#     headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
#     response = requests.post(API_URL, headers=headers, json=payload)
    
#     if response.status_code != 200:
#         try:
#             error_message = response.json().get("error", "Unknown API error")
#             if "is currently loading" in error_message:
#                 return {"error": "Model is loading, please try again in a few moments."}
#             return {"error": f"API Error: {error_message}"}
#         except requests.exceptions.JSONDecodeError:
#             return {"error": "Failed to decode API response."}
            
#     return response.content

# # ---------------------------
# # FLASK API ROUTE
# # ---------------------------
# @app.route('/generate', methods=['POST'])
# def generate():
#     """
#     Handles the image generation request from the frontend.
#     Expects a JSON body with a "prompt" key.
#     Returns a JSON response with the URL of the generated image.
#     """
#     # ✅ Changed: Read JSON data from the request instead of form data
#     data = request.get_json()
#     if not data or 'prompt' not in data:
#         return jsonify({'error': 'Prompt is missing from request body'}), 400
    
#     user_prompt = data['prompt']
#     if not user_prompt.strip():
#         return jsonify({'error': 'Prompt cannot be empty'}), 400

#     refined_prompt = refine_prompt(user_prompt)
#     print(f"Generating image with prompt: {refined_prompt}")
    
#     payload = {"inputs": refined_prompt}
#     image_bytes = query_api(payload)
    
#     if isinstance(image_bytes, dict) and "error" in image_bytes:
#         return jsonify(image_bytes), 500
    
#     # --- Save the generated image to a static folder ---
#     timestamp = int(time.time())
#     image_filename = f"generated_{timestamp}.png"
#     # Ensure the path is correct for your project structure
#     image_path_for_saving = os.path.join('static', 'generated', image_filename)
    
#     with open(image_path_for_saving, "wb") as f:
#         f.write(image_bytes)
        
#     print(f"Image saved to {image_path_for_saving}")

#     # --- Create the full URL to be sent back to the frontend ---
#     # This URL must be accessible from the user's browser
#     base_url = request.host_url.replace('127.0.0.1', 'localhost')
#     full_image_url = f"{base_url}{image_path_for_saving}"
    
#     # ✅ Changed: Return a JSON response with the image URL
#     return jsonify({
#         'imageUrl': full_image_url,
#         'prompt': user_prompt,
#         'used_prompt': refined_prompt
#     })

# # ---------------------------
# # RUN THE APP
# # ---------------------------
# if __name__ == '__main__':
#     # Create the directory for generated images if it doesn't exist
#     os.makedirs(os.path.join('static', 'generated'), exist_ok=True)
    
#     # ✅ Changed: Run on port 5001 to avoid conflict with the Node.js server
#     app.run(debug=True, port=5001)


# import os
# import requests
# import time
# from dotenv import load_dotenv
# from flask import Flask, jsonify, request
# from flask_cors import CORS
# from pymongo import MongoClient
# from datetime import datetime
# import uuid

# # ---------------------------
# # INITIAL SETUP
# # ---------------------------
# load_dotenv()

# app = Flask(__name__)
# CORS(app, supports_credentials=True)

# # ---------------------------
# # MONGODB CONFIGURATION
# # ---------------------------
# MONGODB_URI = os.getenv("MONGODB_URI")
# client = MongoClient(MONGODB_URI)
# db = client['ai_image_generator']  # Your database name
# images_collection = db['images']   # Your collection name

# # ---------------------------
# # HUGGING FACE CONFIGURATION
# # ---------------------------
# HF_API_TOKEN = os.getenv("HF_API_TOKEN")
# API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"

# # ---------------------------
# # HELPER FUNCTIONS
# # ---------------------------
# def refine_prompt(prompt: str) -> str:
#     enhancements = "4k, 8k, photorealistic, ultra detailed, masterpiece, professional lighting, vibrant colors"
#     return f"{prompt}, {enhancements}"

# def query_api(payload):
#     headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
#     response = requests.post(API_URL, headers=headers, json=payload)
    
#     if response.status_code != 200:
#         try:
#             error_message = response.json().get("error", "Unknown API error")
#             if "is currently loading" in error_message:
#                 return {"error": "Model is loading, please try again in a few moments."}
#             return {"error": f"API Error: {error_message}"}
#         except requests.exceptions.JSONDecodeError:
#             return {"error": "Failed to decode API response."}
            
#     return response.content

# # ---------------------------
# # API ROUTES
# # ---------------------------
# @app.route('/generate', methods=['POST'])
# def generate():
#     """
#     Generate image and save to MongoDB
#     """
#     data = request.get_json()
#     if not data or 'prompt' not in data:
#         return jsonify({'error': 'Prompt is missing from request body'}), 400
    
#     user_prompt = data['prompt']
#     if not user_prompt.strip():
#         return jsonify({'error': 'Prompt cannot be empty'}), 400

#     refined_prompt = refine_prompt(user_prompt)
#     print(f"Generating image with prompt: {refined_prompt}")
    
#     payload = {"inputs": refined_prompt}
#     image_bytes = query_api(payload)
    
#     if isinstance(image_bytes, dict) and "error" in image_bytes:
#         return jsonify(image_bytes), 500
    
#     # Save the generated image to static folder
#     timestamp = int(time.time())
#     image_filename = f"generated_{timestamp}.png"
#     image_path_for_saving = os.path.join('static', 'generated', image_filename)
    
#     with open(image_path_for_saving, "wb") as f:
#         f.write(image_bytes)
        
#     print(f"Image saved to {image_path_for_saving}")

#     # Create the full URL
#     base_url = request.host_url.replace('127.0.0.1', 'localhost')
#     full_image_url = f"{base_url}{image_path_for_saving}"
    
#     # ✅ Automatically save to MongoDB after generation
#     try:
#         image_data = {
#             '_id': str(uuid.uuid4()),
#             'prompt': user_prompt,
#             'imageUrl': full_image_url,
#             'createdAt': datetime.utcnow(),
#             'refinedPrompt': refined_prompt
#         }
        
#         result = images_collection.insert_one(image_data)
#         print(f"Image saved to MongoDB with id: {result.inserted_id}")
        
#     except Exception as e:
#         print(f"Error saving to MongoDB: {str(e)}")
#         return jsonify({'error': f'Failed to save image to database: {str(e)}'}), 500
    
#     return jsonify({
#         'imageUrl': full_image_url,
#         'prompt': user_prompt,
#         'used_prompt': refined_prompt,
#         'id': image_data['_id']
#     })

# @app.route('/api/images', methods=['POST'])
# def save_image():
#     """
#     Save image to MongoDB (if you want separate save endpoint)
#     """
#     try:
#         data = request.get_json()
#         if not data or 'prompt' not in data or 'imageUrl' not in data:
#             return jsonify({'msg': 'Missing prompt or imageUrl'}), 400
        
#         image_data = {
#             '_id': str(uuid.uuid4()),
#             'prompt': data['prompt'],
#             'imageUrl': data['imageUrl'],
#             'createdAt': datetime.utcnow()
#         }
        
#         result = images_collection.insert_one(image_data)
        
#         return jsonify({
#             'id': image_data['_id'],
#             'prompt': image_data['prompt'],
#             'imageUrl': image_data['imageUrl'],
#             'createdAt': image_data['createdAt'].isoformat()
#         }), 201
        
#     except Exception as e:
#         print(f"Error saving image to MongoDB: {str(e)}")
#         return jsonify({'msg': f'Database error: {str(e)}'}), 500

# @app.route('/api/images', methods=['GET'])
# def get_images():
#     """
#     Get all images from MongoDB
#     """
#     try:
#         images = list(images_collection.find().sort('createdAt', -1))
        
#         # Convert ObjectId and datetime to serializable formats
#         for image in images:
#             image['id'] = str(image['_id'])
#             del image['_id']
#             image['createdAt'] = image['createdAt'].isoformat()
        
#         return jsonify(images)
        
#     except Exception as e:
#         print(f"Error fetching images from MongoDB: {str(e)}")
#         return jsonify({'msg': f'Database error: {str(e)}'}), 500

# @app.route('/api/logout', methods=['POST'])
# def logout():
#     """
#     Logout endpoint
#     """
#     return jsonify({'msg': 'Logged out successfully'})

# # ---------------------------
# # RUN THE APP
# # ---------------------------
# if __name__ == '__main__':
#     os.makedirs(os.path.join('static', 'generated'), exist_ok=True)
#     app.run(debug=True, port=5001)
# import os
# import requests
# import time
# from dotenv import load_dotenv
# from flask import Flask, jsonify, request, session
# from flask_cors import CORS
# from pymongo import MongoClient
# from datetime import datetime
# import uuid
# import bcrypt

# # ---------------------------
# # INITIAL SETUP
# # ---------------------------
# load_dotenv()

# app = Flask(__name__)
# app.secret_key = os.getenv("SECRET_KEY", "your-secret-key-here")  # Add this to your .env
# CORS(app, supports_credentials=True)

# # ---------------------------
# # MONGODB CONFIGURATION
# # ---------------------------
# MONGODB_URI = os.getenv("MONGODB_URI")
# client = MongoClient(MONGODB_URI)
# db = client['ai_image_generator']
# images_collection = db['images']
# users_collection = db['users']  # New collection for users

# # ---------------------------
# # HUGGING FACE CONFIGURATION
# # ---------------------------
# HF_API_TOKEN = os.getenv("HF_API_TOKEN")
# API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"

# # ---------------------------
# # AUTHENTICATION MIDDLEWARE
# # ---------------------------
# def login_required(f):
#     def decorated_function(*args, **kwargs):
#         if 'user_id' not in session:
#             return jsonify({'msg': 'Please log in first'}), 401
#         return f(*args, **kwargs)
#     decorated_function.__name__ = f.__name__
#     return decorated_function

# # ---------------------------
# # HELPER FUNCTIONS
# # ---------------------------
# def refine_prompt(prompt: str) -> str:
#     enhancements = "4k, 8k, photorealistic, ultra detailed, masterpiece, professional lighting, vibrant colors"
#     return f"{prompt}, {enhancements}"

# def query_api(payload):
#     headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
#     response = requests.post(API_URL, headers=headers, json=payload)
    
#     if response.status_code != 200:
#         try:
#             error_message = response.json().get("error", "Unknown API error")
#             if "is currently loading" in error_message:
#                 return {"error": "Model is loading, please try again in a few moments."}
#             return {"error": f"API Error: {error_message}"}
#         except requests.exceptions.JSONDecodeError:
#             return {"error": "Failed to decode API response."}
            
#     return response.content

# # ---------------------------
# # AUTHENTICATION ROUTES
# # ---------------------------
# @app.route('/api/register', methods=['POST'])
# def register():
#     try:
#         data = request.get_json()
#         email = data.get('email')
#         password = data.get('password')
        
#         if not email or not password:
#             return jsonify({'msg': 'Email and password required'}), 400
        
#         # Check if user already exists
#         if users_collection.find_one({'email': email}):
#             return jsonify({'msg': 'User already exists'}), 400
        
#         # Hash password
#         hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
#         # Create user
#         user_data = {
#             '_id': str(uuid.uuid4()),
#             'email': email,
#             'password': hashed_password,
#             'createdAt': datetime.utcnow()
#         }
        
#         users_collection.insert_one(user_data)
        
#         return jsonify({'msg': 'User created successfully'}), 201
        
#     except Exception as e:
#         print(f"Registration error: {str(e)}")
#         return jsonify({'msg': 'Registration failed'}), 500

# @app.route('/api/login', methods=['POST'])
# def login():
#     try:
#         data = request.get_json()
#         email = data.get('email')
#         password = data.get('password')
        
#         if not email or not password:
#             return jsonify({'msg': 'Email and password required'}), 400
        
#         # Find user
#         user = users_collection.find_one({'email': email})
#         if not user:
#             return jsonify({'msg': 'Invalid credentials'}), 401
        
#         # Check password
#         if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
#             return jsonify({'msg': 'Invalid credentials'}), 401
        
#         # Create session
#         session['user_id'] = user['_id']
#         session['user_email'] = user['email']
        
#         return jsonify({
#             'msg': 'Login successful',
#             'user': {
#                 'id': user['_id'],
#                 'email': user['email']
#             }
#         })
        
#     except Exception as e:
#         print(f"Login error: {str(e)}")
#         return jsonify({'msg': 'Login failed'}), 500

# @app.route('/api/logout', methods=['POST'])
# def logout():
#     session.clear()
#     return jsonify({'msg': 'Logged out successfully'})

# @app.route('/api/check-auth', methods=['GET'])
# def check_auth():
#     if 'user_id' in session:
#         return jsonify({
#             'authenticated': True,
#             'user': {
#                 'id': session['user_id'],
#                 'email': session['user_email']
#             }
#         })
#     return jsonify({'authenticated': False}), 401

# # ---------------------------
# # IMAGE ROUTES (PROTECTED)
# # ---------------------------
# @app.route('/generate', methods=['POST'])
# @login_required
# def generate():
#     """
#     Generate image and save to MongoDB with user association
#     """
#     data = request.get_json()
#     if not data or 'prompt' not in data:
#         return jsonify({'error': 'Prompt is missing from request body'}), 400
    
#     user_prompt = data['prompt']
#     if not user_prompt.strip():
#         return jsonify({'error': 'Prompt cannot be empty'}), 400

#     refined_prompt = refine_prompt(user_prompt)
#     print(f"Generating image for user {session['user_id']} with prompt: {refined_prompt}")
    
#     payload = {"inputs": refined_prompt}
#     image_bytes = query_api(payload)
    
#     if isinstance(image_bytes, dict) and "error" in image_bytes:
#         return jsonify(image_bytes), 500
    
#     # Save the generated image to static folder
#     timestamp = int(time.time())
#     image_filename = f"generated_{timestamp}.png"
#     image_path_for_saving = os.path.join('static', 'generated', image_filename)
    
#     with open(image_path_for_saving, "wb") as f:
#         f.write(image_bytes)
        
#     print(f"Image saved to {image_path_for_saving}")

#     # Create the full URL
#     base_url = request.host_url.replace('127.0.0.1', 'localhost')
#     full_image_url = f"{base_url}{image_path_for_saving}"
    
#     # Save to MongoDB with user association
#     try:
#         image_data = {
#             '_id': str(uuid.uuid4()),
#             'userId': session['user_id'],  # ✅ Associate with user
#             'prompt': user_prompt,
#             'imageUrl': full_image_url,
#             'createdAt': datetime.utcnow(),
#             'refinedPrompt': refined_prompt
#         }
        
#         result = images_collection.insert_one(image_data)
#         print(f"Image saved to MongoDB for user {session['user_id']}")
        
#     except Exception as e:
#         print(f"Error saving to MongoDB: {str(e)}")
#         return jsonify({'error': f'Failed to save image to database: {str(e)}'}), 500
    
#     return jsonify({
#         'imageUrl': full_image_url,
#         'prompt': user_prompt,
#         'used_prompt': refined_prompt,
#         'id': image_data['_id']
#     })

# @app.route('/api/images', methods=['GET'])
# @login_required
# def get_images():
#     """
#     Get only the current user's images from MongoDB
#     """
#     try:
#         # ✅ Only get images for the logged-in user
#         images = list(images_collection.find(
#             {'userId': session['user_id']}
#         ).sort('createdAt', -1))
        
#         # Convert ObjectId and datetime to serializable formats
#         for image in images:
#             image['id'] = str(image['_id'])
#             del image['_id']
#             image['createdAt'] = image['createdAt'].isoformat()
        
#         return jsonify(images)
        
#     except Exception as e:
#         print(f"Error fetching images from MongoDB: {str(e)}")
#         return jsonify({'msg': f'Database error: {str(e)}'}), 500

# @app.route('/api/images', methods=['POST'])
# @login_required
# def save_image():
#     """
#     Save image to MongoDB with user association
#     """
#     try:
#         data = request.get_json()
#         if not data or 'prompt' not in data or 'imageUrl' not in data:
#             return jsonify({'msg': 'Missing prompt or imageUrl'}), 400
        
#         image_data = {
#             '_id': str(uuid.uuid4()),
#             'userId': session['user_id'],  # ✅ Associate with user
#             'prompt': data['prompt'],
#             'imageUrl': data['imageUrl'],
#             'createdAt': datetime.utcnow()
#         }
        
#         result = images_collection.insert_one(image_data)
        
#         return jsonify({
#             'id': image_data['_id'],
#             'prompt': image_data['prompt'],
#             'imageUrl': image_data['imageUrl'],
#             'createdAt': image_data['createdAt'].isoformat()
#         }), 201
        
#     except Exception as e:
#         print(f"Error saving image to MongoDB: {str(e)}")
#         return jsonify({'msg': f'Database error: {str(e)}'}), 500

# # ---------------------------
# # RUN THE APP
# # ---------------------------
# if __name__ == '__main__':
#     os.makedirs(os.path.join('static', 'generated'), exist_ok=True)
#     app.run(debug=True, port=5001)

import os
import requests
import time
import base64
from dotenv import load_dotenv
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import uuid
import bcrypt
from io import BytesIO

# ---------------------------
# INITIAL SETUP
# ---------------------------
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "your-secret-key-here")
CORS(app, supports_credentials=True)

# ---------------------------
# MONGODB CONFIGURATION
# ---------------------------
MONGODB_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGODB_URI)
db = client['ai_image_generator']
images_collection = db['images']
users_collection = db['users']

# ---------------------------
# HUGGING FACE CONFIGURATION
# ---------------------------
HF_API_TOKEN = os.getenv("HF_API_TOKEN")
API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"

# ---------------------------
# AUTHENTICATION MIDDLEWARE
# ---------------------------
def login_required(f):
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'msg': 'Please log in first'}), 401
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

# ---------------------------
# HELPER FUNCTIONS
# ---------------------------
def refine_prompt(prompt: str) -> str:
    enhancements = "4k, 8k, photorealistic, ultra detailed, masterpiece, professional lighting, vibrant colors"
    return f"{prompt}, {enhancements}"

def query_api(payload):
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
    response = requests.post(API_URL, headers=headers, json=payload)
    
    if response.status_code != 200:
        try:
            error_message = response.json().get("error", "Unknown API error")
            if "is currently loading" in error_message:
                return {"error": "Model is loading, please try again in a few moments."}
            return {"error": f"API Error: {error_message}"}
        except requests.exceptions.JSONDecodeError:
            return {"error": "Failed to decode API response."}
            
    return response.content

# ---------------------------
# AUTHENTICATION ROUTES
# ---------------------------
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'msg': 'Email and password required'}), 400
        
        # Check if user already exists
        if users_collection.find_one({'email': email}):
            return jsonify({'msg': 'User already exists'}), 400
        
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user
        user_data = {
            '_id': str(uuid.uuid4()),
            'name': name,
            'email': email,
            'password': hashed_password,
            'createdAt': datetime.utcnow()
        }
        
        users_collection.insert_one(user_data)
        
        # Auto-login after registration
        session['user_id'] = user_data['_id']
        session['user_email'] = email
        
        return jsonify({
            'msg': 'User created successfully',
            'user': {
                'id': user_data['_id'],
                'name': name,
                'email': email
            }
        }), 201
        
    except Exception as e:
        print(f"Registration error: {str(e)}")
        return jsonify({'msg': 'Registration failed'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'msg': 'Email and password required'}), 400
        
        # Find user
        user = users_collection.find_one({'email': email})
        if not user:
            return jsonify({'msg': 'Invalid credentials'}), 401
        
        # Check password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return jsonify({'msg': 'Invalid credentials'}), 401
        
        # Create session
        session['user_id'] = user['_id']
        session['user_email'] = user['email']
        
        return jsonify({
            'msg': 'Login successful',
            'user': {
                'id': user['_id'],
                'name': user.get('name', ''),
                'email': user['email']
            }
        })
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'msg': 'Login failed'}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'msg': 'Logged out successfully'})

@app.route('/api/check-auth', methods=['GET'])
def check_auth():
    if 'user_id' in session:
        user = users_collection.find_one({'_id': session['user_id']})
        if user:
            return jsonify({
                'authenticated': True,
                'user': {
                    'id': user['_id'],
                    'name': user.get('name', ''),
                    'email': user['email']
                }
            })
    return jsonify({'authenticated': False}), 401

# ---------------------------
# IMAGE ROUTES (PROTECTED) - STORE IN MONGODB
# ---------------------------
@app.route('/generate', methods=['POST'])
@login_required
def generate():
    """
    Generate image and store directly in MongoDB as Base64
    """
    data = request.get_json()
    if not data or 'prompt' not in data:
        return jsonify({'error': 'Prompt is missing from request body'}), 400
    
    user_prompt = data['prompt']
    if not user_prompt.strip():
        return jsonify({'error': 'Prompt cannot be empty'}), 400

    refined_prompt = refine_prompt(user_prompt)
    print(f"Generating image for user {session['user_id']} with prompt: {refined_prompt}")
    
    payload = {"inputs": refined_prompt}
    image_bytes = query_api(payload)
    
    if isinstance(image_bytes, dict) and "error" in image_bytes:
        return jsonify(image_bytes), 500
    
    # ✅ Convert image to Base64 and store directly in MongoDB
    try:
        # Convert bytes to Base64 string
        image_base64 = base64.b64encode(image_bytes).decode('utf-8')
        
        # Create image data with Base64 string
        image_data = {
            '_id': str(uuid.uuid4()),
            'userId': session['user_id'],
            'userEmail': session['user_email'],
            'prompt': user_prompt,
            'imageData': image_base64,  # ✅ Store image as Base64
            'imageFormat': 'png',
            'createdAt': datetime.utcnow(),
            'refinedPrompt': refined_prompt
        }
        
        result = images_collection.insert_one(image_data)
        print(f"✅ Image saved directly to MongoDB with id: {result.inserted_id}")
        
        # Return the image data (Frontend will use data URL)
        return jsonify({
            'id': image_data['_id'],
            'prompt': user_prompt,
            'used_prompt': refined_prompt,
            'imageData': f"data:image/png;base64,{image_base64}",  # Data URL for frontend
            'createdAt': image_data['createdAt'].isoformat()
        })
        
    except Exception as e:
        print(f"❌ Error saving image to MongoDB: {str(e)}")
        return jsonify({'error': f'Failed to save image to database: {str(e)}'}), 500

@app.route('/api/images', methods=['GET'])
@login_required
def get_images():
    """
    Get user's images from MongoDB and return as Data URLs
    """
    try:
        # Get images for the logged-in user
        images = list(images_collection.find(
            {'userId': session['user_id']}
        ).sort('createdAt', -1))
        
        # Convert to serializable format with Data URLs
        result = []
        for image in images:
            # Create Data URL from Base64
            image_data_url = f"data:image/{image.get('imageFormat', 'png')};base64,{image['imageData']}"
            
            result.append({
                'id': image['_id'],
                'userId': image['userId'],
                'prompt': image['prompt'],
                'imageUrl': image_data_url,  # Data URL for frontend
                'createdAt': image['createdAt'].isoformat(),
                'refinedPrompt': image.get('refinedPrompt', '')
            })
        
        print(f"✅ Retrieved {len(result)} images for user {session['user_id']}")
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ Error fetching images from MongoDB: {str(e)}")
        return jsonify({'msg': f'Database error: {str(e)}'}), 500

@app.route('/api/image/<image_id>', methods=['GET'])
@login_required
def get_single_image(image_id):
    """
    Get a single image by ID
    """
    try:
        image = images_collection.find_one({
            '_id': image_id,
            'userId': session['user_id']  # Ensure user owns the image
        })
        
        if not image:
            return jsonify({'msg': 'Image not found'}), 404
        
        # Create Data URL from Base64
        image_data_url = f"data:image/{image.get('imageFormat', 'png')};base64,{image['imageData']}"
        
        return jsonify({
            'id': image['_id'],
            'prompt': image['prompt'],
            'imageUrl': image_data_url,
            'createdAt': image['createdAt'].isoformat()
        })
        
    except Exception as e:
        print(f"❌ Error fetching image: {str(e)}")
        return jsonify({'msg': 'Error fetching image'}), 500

# ---------------------------
# RUN THE APP
# ---------------------------
if __name__ == '__main__':
    # Ensure the images collection has an index for better performance
    images_collection.create_index([('userId', 1), ('createdAt', -1)])
    
    print("🚀 Starting Flask server on port 5001...")
    print("💾 Images will be stored directly in MongoDB Atlas")
    app.run(debug=True, port=5001)