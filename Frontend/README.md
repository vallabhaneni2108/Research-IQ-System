# ResearchIQ — Multi-Agent AI Research System

ResearchIQ is an AI-powered research system that uses multiple specialized agents to search the web, extract detailed information, generate a structured research report, and critically evaluate the final output.

## 🚀 Features

- 🔎 **Web Search Agent** — searches the web for relevant and recent information.
- 📖 **Reader Agent** — extracts useful information from selected web pages.
- ✍️ **Research Writer** — generates a structured research report.
- 🧐 **Research Critic** — evaluates the report for accuracy, clarity, completeness, source quality, and depth.
- 🌐 **Modern Web UI** — React-based frontend for interacting with the system.
- ⚡ **FastAPI Backend** — REST API connecting the frontend with the AI research pipeline.
- 🔄 **Modular LLM Architecture** — LLM provider can be changed through environment configuration.

## 🏗️ Architecture

```text
                         User
                           │
                           ▼
                  ┌─────────────────┐
                  │ React Frontend  │
                  └────────┬────────┘
                           │
                    POST /api/research
                           │
                           ▼
                  ┌─────────────────┐
                  │ FastAPI Backend │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  Search Agent   │
                  │   Web Search    │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  Reader Agent   │
                  │  Web Scraper    │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │     Writer      │
                  │ Research Report │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │     Critic      │
                  │ Quality Review  │
                  └────────┬────────┘
                           │
                           ▼
                    Final Research
                        Report
```

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Framer Motion
- Lucide React

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic

### AI / LLM

- LangChain
- LangGraph
- OpenRouter
- Configurable LLM models

### Tools

- Tavily — web search
- BeautifulSoup — web scraping
- Requests — HTTP requests

## 📁 Project Structure

```text
Research-IQ-System/
│
├── backend/
│   ├── api.py
│   ├── agents.py
│   ├── pipeline.py
│   ├── tools.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   └── index.html
│
├── .gitignore
└── README.md
```

## 🔄 Research Workflow

### 1. Search Agent

Receives the user's research topic and searches the web for relevant sources using Tavily.

The agent collects:

- Source titles
- URLs
- Relevant snippets
- Supporting information

### 2. Reader Agent

Receives the search results and selects a relevant source.

It uses the web scraping tool to extract useful page content for deeper analysis.

### 3. Writer

The writer receives the collected research and produces a structured report containing:

- Introduction
- Key Findings
- Conclusion
- Sources

### 4. Critic

The critic evaluates the generated report based on:

- Accuracy
- Clarity
- Completeness
- Organization
- Source quality
- Depth of analysis

It returns a score and specific improvement suggestions.

## ⚙️ Local Setup

### Prerequisites

Make sure you have:

- Python 3.10+
- Node.js
- Git

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/researchiq.git
cd researchiq
```

## 🔐 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```powershell
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file inside `backend/`:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=your_model
TAVILY_API_KEY=your_tavily_api_key
```

Never commit `.env` to GitHub.

### Start the backend

```bash
python -m uvicorn api:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
http://127.0.0.1:8000/health
```

## 💻 Frontend Setup

Open another terminal and navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## 🔌 API

### Health Check

```http
GET /health
```

Response:

```json
{
  "status": "healthy"
}
```

### Research

```http
POST /api/research
```

Request:

```json
{
  "topic": "Impact of AI agents on software development"
}
```

The API returns the research results, generated report, critic feedback, and source information.

## 🔒 Security

API keys are stored using environment variables.

The following files and directories should never be committed:

```text
.env
.venv/
__pycache__/
node_modules/
dist/
```

## 🚀 Deployment

ResearchIQ can be deployed using:

- Render
- Vercel
- Other cloud platforms supporting Python and React

Recommended deployment architecture:

```text
GitHub
   │
   ├── React Frontend
   │       ↓
   │    Render / Vercel
   │
   └── FastAPI Backend
           ↓
        Render
```

The frontend communicates with the deployed FastAPI backend through the `/api/research` endpoint.

## 📌 Future Improvements

Planned improvements include:

- Multi-source research instead of relying on a single scraped source
- Parallel agent execution
- Improved source verification
- Research history
- PDF report export
- User authentication
- Persistent research storage
- Advanced citation handling
- More specialized research agents
- Production monitoring and logging

## 🎯 Project Goal

ResearchIQ was built as a practical exploration of modern AI engineering concepts including:

- LLM applications
- AI agents
- Tool calling
- Web search
- Web scraping
- Agent orchestration
- Prompt engineering
- FastAPI
- React
- LLM provider abstraction
- Cloud deployment

## 👨‍💻 Author

**vallabhaneni chenchaiah**

Built as an AI Engineering portfolio project.