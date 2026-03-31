# ClueCraft Investigation Game 🕵️‍♂️🔍

Welcome to **ClueCraft**, an immersive, high-energy detective investigation experience built with React and Flask! 

This application transforms a classic mystery into a dynamic, neon-themed gaming experience where players investigate crime scenes, interrogate suspects, unearth secrets, and solve cases efficiently.

## 🚀 Live Demo

- **Backend / Main Game Engine API:** [https://xwave.pythonanywhere.com/](https://xwave.pythonanywhere.com/)
- **Frontend Live URL:** [https://Ayush10346.github.io/ClueCraft](https://Ayush10346.github.io/ClueCraft)

## 🛠️ Technology Stack

- **Frontend:** React, Vite, Vanilla CSS 
- **Backend:** Python, Flask, SQLite3
- **Deployment:** GitHub Pages (Frontend), PythonAnywhere (Backend)

## 🎮 Features

1. **Gamified Investigation:** A phased game loop featuring Quest Mode, Case Briefings, and the Interrogation Room.
2. **Neon-Themed UI:** A stunning, vibrant dark-mode dashboard with glass-morphic elements and arcade-style typography.
3. **Dynamic Mini-Games:** Challenges like solving mazes and decrypting passwords to unlock critical evidence.
4. **Scoring System:** Efficiency-based points encouraging users to crack the case using minimal time and clues!

## 💻 Local Development Setup

To run ClueCraft locally, you'll need two terminals for the backend and frontend.

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Activate virtual environment
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
python app.py
```
The backend API server runs on `http://127.0.0.1:5000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
The frontend Vite server runs on `http://localhost:5173`. Make sure the backend server is running simultaneously so the frontend can retrieve the cases!

## 📸 Screenshots & Gameplay

Jump into the [ClueCraft Live Demo](https://Ayush10346.github.io/ClueCraft) to experience the investigation!
