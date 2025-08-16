import os
import sys
import asyncio
import threading
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp

# Import bot components
from config.env import ENV
from config.baileys_config import startBaileys, getBaileysSocket
from controllers.message_controller import sendMessageFromWebhook
from controllers.session_controller import startSession, getSessionStatus, closeSession
from middlewares.auth_middleware import authenticateWebhook
from utils.logger import logger

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Enable CORS for all routes
CORS(app)

app.register_blueprint(user_bp, url_prefix='/api')

# Bot routes
@app.route('/webhook/send-message', methods=['POST'])
def webhook_send_message():
    # Simple auth check
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Não autorizado: Token de autenticação não fornecido.'}), 401
    
    token = auth_header.split(' ')[1]
    if token != ENV['WEBHOOK_SECRET']:
        return jsonify({'error': 'Acesso proibido: Token de autenticação inválido.'}), 403
    
    return sendMessageFromWebhook(request, None)

@app.route('/session/start', methods=['POST'])
def session_start():
    return startSession(request, None)

@app.route('/session/status', methods=['GET'])
def session_status():
    return getSessionStatus(request, None)

@app.route('/session/close', methods=['POST'])
def session_close():
    return closeSession(request, None)

# uncomment if you need to use database
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
with app.app_context():
    db.create_all()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

def start_bot_in_thread():
    """Start the Baileys bot in a separate thread"""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        loop.run_until_complete(startBaileys())
    except Exception as e:
        logger.error(f"Error starting Baileys: {e}")

if __name__ == '__main__':
    # Start the bot in a separate thread
    bot_thread = threading.Thread(target=start_bot_in_thread, daemon=True)
    bot_thread.start()
    
    # Start Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)

