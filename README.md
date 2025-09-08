<p align="center">
  <img src="frontend/public/mainlogo.png" alt="SwasthyaSetu Logo" width="120"/>
</p>

<h1 align="center">🏥 SwasthyaSetu - Healthcare Platform</h1>

<p align="center">
  <b>Comprehensive healthcare platform powered by AI & modern web technologies</b>
</p>

<p align="center">
  <a href="https://github.com/Snehadas2005/SwasthyaSetu/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License"/>
  </a>
  <img src="https://img.shields.io/badge/Node.js-16+-informational?logo=node.js&color=68A063"/>
  <img src="https://img.shields.io/badge/Python-3.8+-blue?logo=python"/>
  <img src="https://img.shields.io/badge/MongoDB-Running-success?logo=mongodb"/>
  <img src="https://img.shields.io/github/last-commit/Snehadas2005/SwasthyaSetu" />
  <img src="https://img.shields.io/github/commit-activity/m/Snehadas2005/SwasthyaSetu" />
</p>

---

## 🌟 Features  
- **Multi-Role Support**: Patients, Doctors, Authorities, Pharmacies  
- **AI Symptom Checker**: ML-based disease prediction  
- **Prescription OCR**: Automatic medicine extraction from images  
- **Medical Chatbot**: 24/7 healthcare guidance  
- **Multilingual**: English, Hindi, Bengali, Marathi, Telugu  

---

## 🏗️ Architecture  

| Component              | Technology        | Port | Purpose                 |  
|------------------------|------------------|------|-------------------------|  
| **Frontend**           | React 18         | 3001 | Main UI                 |  
| **Auth Backend**       | Node.js/Express  | 3000 | Authentication service  |  
| **Symptom Checker**    | Python Flask     | 5000 | AI symptom analysis     |  
| **Prescription OCR**   | FastAPI          | 8000 | Prescription processing |  

---

## 🚀 Quick Start  

### Prerequisites  
- Node.js 16+  
- Python 3.8+  
- MongoDB  
- Git  

### Windows (Recommended)  
```bash
git clone <repo-url>
cd SwasthyaSetu
start_system.bat
````

### Linux/Mac

```bash
chmod +x start_system.sh
./start_system.sh
```

---

## 🌐 Access Points

* **Main App** → [http://localhost:3001](http://localhost:3001)
* **Auth API** → [http://localhost:3000](http://localhost:3000)
* **Symptom API** → [http://localhost:5000](http://localhost:5000)
* **Prescription API Docs** → [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📁 Project Structure

```
SwasthyaSetu/
├── frontend/                        # React main app
├── Login-RegistrationForm-MongoDB-main/  # Auth backend (Node.js + MongoDB)
├── ai/
│   ├── symptom-checker/              # Symptom analysis (Flask)
│   └── prescription-analyzer/        # OCR processing (FastAPI)
├── .gitignore                        # Git ignore rules
├── .gitattributes                    # Git attributes
└── netlify.toml                      # Deployment config
```

---

## 🔧 Configuration

### Auth Backend (`.env`)

```
MONGODB_URI=mongodb://localhost:27017/swasthyasetu
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3001
```

### Prescription Analyzer (`.env`)

```
COHERE_API_KEY=your-cohere-key
TESSERACT_PATH=tesseract
```

---

## 🌐 API Endpoints

### Auth API (3000)

* `POST /api/login` → User login
* `GET /health` → Health check

### Symptom Checker (5000)

* `POST /analyze` → Symptom analysis
* `GET /symptoms` → Available symptoms

### Prescription Analyzer (8000)

* `POST /api/analyze-prescription` → Image analysis
* `GET /docs` → API documentation

---

## 🛡️ Security

* JWT Authentication
* Rate Limiting
* Input Validation
* CORS Configuration
* Password Encryption

---

## 🏥 Medical Safety

* Emergency symptom detection
* Medical disclaimers
* Age-based risk assessment
* Professional recommendations

---

## 🛠️ Development

```bash
# Terminal 1 - Auth
cd Login-RegistrationForm-MongoDB-main
npm start

# Terminal 2 - Symptom Checker
cd ai/symptom-checker
python run.py

# Terminal 3 - Prescription Analyzer
cd ai/prescription-analyzer/backend
python main.py

# Terminal 4 - Frontend
cd frontend
PORT=3001 npm start
```

---

## 🆘 Troubleshooting

* **Port conflicts** → Change ports or kill processes
* **MongoDB issues** → Ensure MongoDB is running
* **Missing models** → Run training scripts first
* **CORS errors** → Check `FRONTEND_URL` config

---

## 📚 Documentation

* `SYSTEM_OVERVIEW.md` → Full system design
* `QUICK_START.md` → Setup instructions
* API Docs at [http://localhost:8000/docs](http://localhost:8000/docs)
