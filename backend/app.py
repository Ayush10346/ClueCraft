import os
import sqlite3
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

from flask import send_from_directory
app = Flask(__name__, static_folder='static', static_url_path='/')
CORS(app)

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cluecraft.db')

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS themes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE,
                description TEXT,
                icon TEXT,
                image TEXT
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS cases (
                id TEXT PRIMARY KEY,
                title TEXT,
                location TEXT,
                icon TEXT,
                image TEXT,
                description TEXT,
                story TEXT,
                difficulty TEXT,
                killer TEXT,
                explanation TEXT,
                clues TEXT,
                suspects TEXT,
                theme_id INTEGER REFERENCES themes(id)
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS leaderboard (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                case_title TEXT,
                score INTEGER,
                time TEXT,
                badge TEXT
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                email TEXT,
                password_hash TEXT,
                role TEXT
            )
        ''')
        # Seed admin accounts
        admin_pwd = generate_password_hash("password")
        for u in ["admin", "admin1", "admin2", "admin3"]:
            conn.execute('INSERT OR IGNORE INTO users (username, password_hash, role) VALUES (?, ?, ?)', (u, admin_pwd, "admin"))
        # Seed default themes
        default_themes = [
            ('Murder', 'Homicide investigations — find the killer before they strike again.', '🔪', '/themes/murder.png'),
            ('Robbery', 'Heists and break-ins — follow the money trail.', '💰', '/themes/robbery.png'),
            ('Kidnapping', 'Missing persons — race against the clock to find the victim.', '🔗', '/themes/kidnapping.png'),
        ]
        for name, desc, icon, image in default_themes:
            conn.execute('INSERT OR IGNORE INTO themes (name, description, icon, image) VALUES (?, ?, ?, ?)', (name, desc, icon, image))

def migrate_db():
    """Run lightweight migrations on existing DB."""
    with get_db() as conn:
        # Ensure themes table exists
        conn.execute('''
            CREATE TABLE IF NOT EXISTS themes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE,
                description TEXT,
                icon TEXT,
                image TEXT
            )
        ''')
        # Add theme_id column to cases if missing
        cols = [row[1] for row in conn.execute('PRAGMA table_info(cases)').fetchall()]
        if 'theme_id' not in cols:
            conn.execute('ALTER TABLE cases ADD COLUMN theme_id INTEGER REFERENCES themes(id)')
        # Seed default themes
        default_themes = [
            ('Murder', 'Homicide investigations — find the killer before they strike again.', '🔪', '/themes/murder.png'),
            ('Robbery', 'Heists and break-ins — follow the money trail.', '💰', '/themes/robbery.png'),
            ('Kidnapping', 'Missing persons — race against the clock to find the victim.', '🔗', '/themes/kidnapping.png'),
        ]
        for name, desc, icon, image in default_themes:
            conn.execute('INSERT OR IGNORE INTO themes (name, description, icon, image) VALUES (?, ?, ?, ?)', (name, desc, icon, image))
        # Seed extra admin accounts
        admin_pwd = generate_password_hash("password")
        for u in ["admin", "admin1", "admin2", "admin3"]:
            conn.execute('INSERT OR IGNORE INTO users (username, password_hash, role) VALUES (?, ?, ?)', (u, admin_pwd, "admin"))
            
        # Migrate orphan cases into Murder (theme_id=1)
        murder = conn.execute('SELECT id FROM themes WHERE name = ?', ('Murder',)).fetchone()
        if murder:
            conn.execute('UPDATE cases SET theme_id = ? WHERE theme_id IS NULL', (murder['id'],))
        # Add play_history table if missing
        conn.execute('''
            CREATE TABLE IF NOT EXISTS play_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT,
                case_id TEXT,
                case_title TEXT,
                theme_name TEXT,
                score INTEGER,
                time_taken TEXT,
                result TEXT,
                played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS admin_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                admin TEXT,
                action TEXT,
                target TEXT,
                detail TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

@app.before_request
def setup():
    if not os.path.exists(DB_FILE):
        init_db()
    else:
        migrate_db()

@app.route('/api/themes', methods=['GET'])
def get_themes():
    with get_db() as conn:
        rows = conn.execute('SELECT * FROM themes').fetchall()
        themes = []
        for t in rows:
            d = dict(t)
            case_count = conn.execute('SELECT COUNT(*) as cnt FROM cases WHERE theme_id = ?', (d['id'],)).fetchone()['cnt']
            d['case_count'] = case_count
            themes.append(d)
        return jsonify(themes)

@app.route('/api/themes', methods=['POST'])
def add_theme():
    data = request.json
    with get_db() as conn:
        try:
            conn.execute('INSERT INTO themes (name, description, icon, image) VALUES (?, ?, ?, ?)',
                         (data.get('name'), data.get('description'), data.get('icon'), data.get('image', '')))
        except sqlite3.IntegrityError:
            return jsonify({"error": "Theme already exists"}), 409
    return jsonify({"status": "success"})

@app.route('/api/themes/<int:theme_id>', methods=['DELETE'])
def delete_theme(theme_id):
    with get_db() as conn:
        conn.execute('DELETE FROM themes WHERE id = ?', (theme_id,))
    return jsonify({"status": "success"})

@app.route('/api/cases', methods=['GET'])
def get_cases():
    theme_id = request.args.get('theme_id')
    with get_db() as conn:
        if theme_id:
            rows = conn.execute('SELECT * FROM cases WHERE theme_id = ?', (theme_id,)).fetchall()
        else:
            rows = conn.execute('SELECT * FROM cases').fetchall()
        cases = []
        for r in rows:
            c = dict(r)
            c['clues'] = json.loads(c['clues']) if c['clues'] else []
            c['suspects'] = json.loads(c['suspects']) if c['suspects'] else []
            cases.append(c)
        return jsonify(cases)

@app.route('/api/cases', methods=['POST'])
def add_case():
    data = request.json
    with get_db() as conn:
        conn.execute('''
            INSERT OR REPLACE INTO cases 
            (id, title, location, icon, image, description, story, difficulty, killer, explanation, clues, suspects, theme_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('id'), data.get('title'), data.get('location'), data.get('icon'), data.get('image'),
            data.get('description'), data.get('story'), data.get('difficulty'), data.get('killer'),
            data.get('explanation'), json.dumps(data.get('clues', [])), json.dumps(data.get('suspects', [])),
            data.get('theme_id')
        ))
    return jsonify({"status": "success"})

@app.route('/api/cases/<case_id>', methods=['DELETE'])
def delete_case(case_id):
    data = request.json or {}
    with get_db() as conn:
        case = conn.execute('SELECT title FROM cases WHERE id = ?', (case_id,)).fetchone()
        if case:
            conn.execute('DELETE FROM cases WHERE id = ?', (case_id,))
            conn.execute('INSERT INTO admin_log (admin, action, target, detail) VALUES (?, ?, ?, ?)',
                         (data.get('admin', 'admin'), 'DELETE', case['title'], f'Case "{case["title"]}" deleted'))
    return jsonify({"status": "success"})

@app.route('/api/admin-log', methods=['GET'])
def get_admin_log():
    with get_db() as conn:
        rows = conn.execute('SELECT * FROM admin_log ORDER BY created_at DESC LIMIT 50').fetchall()
        return jsonify([dict(r) for r in rows])

@app.route('/api/admin-log', methods=['POST'])
def add_admin_log():
    data = request.json
    with get_db() as conn:
        conn.execute('INSERT INTO admin_log (admin, action, target, detail) VALUES (?, ?, ?, ?)',
                     (data.get('admin'), data.get('action'), data.get('target'), data.get('detail')))
    return jsonify({"status": "success"})

@app.route('/api/generate', methods=['POST'])
def generate_case():
    data = request.json
    prompt = data.get('prompt')
    difficulty = data.get('difficulty', 'medium')
    api_key = data.get('api_key') or os.environ.get('GEMINI_API_KEY')
    
    if not api_key:
        return jsonify({"error": "No Gemini API key provided"}), 400
        
    system_prompt = f"You are a ClueCraft detective game engine. Generate a murder mystery as valid JSON only — no markdown, no backticks, raw JSON. Return exactly: {{\"title\":\"...\",\"location\":\"...\",\"icon\":\"single emoji\",\"story\":\"2-3 paragraph cinematic story\",\"clues\":[{{\"text\":\"...\",\"misleading\":false}}],\"suspects\":[{{\"name\":\"...\",\"role\":\"...\",\"motive\":\"...\",\"alibi\":\"...\",\"hidden\":\"...\"}}],\"killer\":\"exact suspect name\",\"explanation\":\"full logical explanation\"}} Rules: 5-6 clues (1 misleading:true), exactly 3 suspects, 1 killer, difficulty: {difficulty}, logically watertight."

    payload = {
        "systemInstruction": {
            "parts": [{"text": system_prompt}]
        },
        "contents": [{
            "parts": [{"text": f"Crime scene: {prompt}"}]
        }],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
        response = requests.post(url, headers={"Content-Type": "application/json"}, json=payload)
        response.raise_for_status()
        res_data = response.json()
        
        text = res_data['candidates'][0]['content']['parts'][0]['text']
        
        case_data = json.loads(text)
        return jsonify(case_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    with get_db() as conn:
        rows = conn.execute('SELECT * FROM leaderboard ORDER BY score DESC LIMIT 10').fetchall()
        return jsonify([dict(r) for r in rows])

@app.route('/api/leaderboard', methods=['POST'])
def add_leaderboard():
    data = request.json
    with get_db() as conn:
        conn.execute('''
            INSERT INTO leaderboard (name, case_title, score, time, badge)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            data.get('name'), data.get('case_title'), data.get('score'), data.get('time'), data.get('badge')
        ))
    return jsonify({"status": "success"})

@app.route('/api/history', methods=['POST'])
def add_history():
    data = request.json
    with get_db() as conn:
        conn.execute('''
            INSERT INTO play_history (username, case_id, case_title, theme_name, score, time_taken, result)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('username'), data.get('case_id'), data.get('case_title'),
            data.get('theme_name'), data.get('score'), data.get('time_taken'), data.get('result')
        ))
    return jsonify({"status": "success"})

@app.route('/api/history/<username>', methods=['GET'])
def get_history(username):
    with get_db() as conn:
        rows = conn.execute(
            'SELECT * FROM play_history WHERE username = ? ORDER BY played_at DESC LIMIT 20',
            (username,)
        ).fetchall()
        return jsonify([dict(r) for r in rows])

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400
        
    pwd_hash = generate_password_hash(password)
    
    with get_db() as conn:
        try:
            conn.execute('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)', 
                         (username, email, pwd_hash, 'player'))
        except sqlite3.IntegrityError:
            return jsonify({"error": "Username already exists"}), 409
            
    return jsonify({"status": "success", "user": {"username": username, "role": "player"}})

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    with get_db() as conn:
        user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
        
        if user and check_password_hash(user['password_hash'], password):
            return jsonify({"status": "success", "user": {"username": user['username'], "role": user['role']}})
        else:
            return jsonify({"error": "Invalid credentials"}), 401

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)
