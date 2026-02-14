# 🤖 PageIndex: Client Support ChatBot 🚀

Welcome to the **PageIndex ChatBot** project! This is a high-performance, AI-driven support system designed for logistics platforms. It features a **FastAPI** backend (Python)

---

## 🌟 Key Features

*   **🧠 PageIndex Intelligence**: Uses a sophisticated navigation tree logic to fetch only relevant data from MongoDB, preventing token overflow and ensuring high accuracy.
*   **🤖 Gemini 1.5 Flash**: Powered by Google's latest AI model for blazing-fast, intelligent support responses.
*   **📂 Multi-Source Context**: Automatically joins data from `users`, `clientprofiles`, `assignevheicles`, and `driverdetails` to answer complex questions.
*   **⚡ FastAPI Backend**: Built with Python for high performance and low latency.
*   **🌐 Dual Frontend**: Serves a sleek web chat interface directly from Vercel while providing robust API endpoints for Flutter mobile apps.
*   **📜 Complete History**: Stores both user queries and assistant responses in MongoDB for full conversation tracking.

---

## 🏗️ The "PageIndex" Concept

This project follows a unique **Structured Data Navigator** approach:

1.  **Intent Mapping**: The backend maps user keywords (e.g., "driver", "wallet", "accountant") to specific data "Nodes".
2.  **Context Building**: Instead of dumping the whole database, it pulls specific fields needed for that Intent.
3.  **Relational Lookup**: Handles complex MongoDB relationships (like finding all drivers assigned to a specific client's trips) automatically.

---

## 🛠️ Tech Stack

*   **Frontend**: 🎨 Vanilla HTML5, CSS3 (Glassmorphism), JavaScript
*   **Backend**: 🐍 Python (FastAPI), Motor (Async MongoDB), Pydantic
*   **AI Engine**: ✨ Google Gemini AI
*   **Hosting**: 🔼 Vercel (Serverless Functions)
*   **Database**: 🍃 MongoDB Atlas

---

## 📂 Project Structure

```text
Flutter_ClientBot/
├── api/
│   └── index.py        # 🐍 FastAPI Backend & AI Logic
├── public/
│   └── index.html      # 🎨 Web Chat Frontend
├── src/
│   ├── pageindex/      # 🏗️ Original Node.js Concept Logic
│   └── prompts/
│       └── system.prompt.txt # 📜 AI Guidelines & Persona
├── vercel.json         # 🔼 Deployment & Routing Config
└── requirements.txt    # 📦 Python Dependencies
```

---

## 🚀 Quick Start (Local Testing)

### 1. Prerequisites
Ensure you have **Python 3.9+** and a **MongoDB** instance ready.

### 2. Setup Environment
Create a `.env` file in the root:
```env
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_ai_key
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Server
```bash
uvicorn api.index:app --reload
```
*   **Frontend**: `http://127.0.0.1:8000/`
*   **API Status**: `http://127.0.0.1:8000/api/status`

---

## 📜 AI Persona & Rules
The bot's behavior is controlled via `src/prompts/system.prompt.txt`. You can update its tone, rules, or guidelines without ever touching the code! 📝

---

### Developed with ❤️ for PageIndex Logistics.
