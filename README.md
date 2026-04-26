# Welcome to Vitamind! 🧠
> *An application that connects a person's vitamin intake to their personal cognitive health*

 
## Table of Contents
- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Feedback and Contributing](#-feedback-and-contributing)
- [Authors](#-authors)

## Project Overview

At CareTech, our main mission is to build projects to promote early-disease detection. 

**Vitamind** is designed to help users track their daily and weekly vitamin intake and understand how it impacts their cognitive health. By analyzing dietary habits, the application provides insights and recommendations to support better brain health over time and takes into each personal user's health and characteristics into account.

## Features

- Track daily vitamin intake
- Analyze impact on cognitive health
- Personalized insights and recommendations
- Food logging and categorization
- Goal-based progress tracking

## Tech Stack

- **Frontend:** React.js, Next.js, Tailwind CSS
- **Backend:** FastAPI, Supabase
- **Database:** PostgreSQL
- **Machine Learning Libraries and Tools:** TensorFlow, YOLO, Roboflow
- **Dataset**: UEC256 + Original Roboflow Dataset (yusuf.abraham@ui.ac.id)

## Database Schema Notes

- `supabase/migrations/` is the source of truth for database changes and is what `supabase db push` applies
- `db/schema/` is kept as reference SQL only and should not be treated as the canonical migration history

## Installation

### 0. Prerequisites

- **Node.js** and **pnpm** or **npm** — for the Next.js frontend
- **Python 3** — for the FastAPI backend

### 1. Clone the repository and use the workshop branch

If you do not have the repo yet:

```bash
git clone https://github.com/CareTech-at-UCI/vitamin-tracking.git
cd vitamin-tracking
```

Download the latest remote branches:

```bash
git fetch origin
```

### 2. Backend (terminal 1)

Open a terminal at the **repository root**, then:

```bash
cd backend
python3 -m venv .venv
```

Activate the virtual environment:

- **macOS / Linux:** `source .venv/bin/activate`
- **Windows (Command Prompt):** `.venv\Scripts\activate.bat`

Install dependencies (this is the same install the project expects):

```bash
pip install -r requirements.txt
```

If `fastapi` is not found or installs incorrectly, try:

```bash
pip install "fastapi[standard]"
```

Create a **`.env`** file in the `backend` directory (not `.env.local`). Copy `backend/.env.example` and fill in your Supabase values.

Optional: `CORS_ORIGINS` defaults to `http://localhost:3000,http://127.0.0.1:3000` so the frontend can call the API.

Start the API (from `backend` with the venv active):

```bash
fastapi dev
```

If the CLI does not pick up the app automatically, run:

```bash
fastapi dev app/main.py
```

- **Interactive API docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) — use this to try each endpoint (e.g. todos under `/api/v1/todos`).

### 3. Frontend (terminal 2)

Use a **second terminal** at the repository root:

```bash
cd frontend
pnpm install
# or: npm install
```

Create **`frontend/.env.local`** (Next.js convention). Copy `frontend/.env.local.example` and set the secrets.

Start the dev server:

```bash
pnpm dev
# or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For the workshop full-stack flow, open [http://localhost:3000/workshop](http://localhost:3000/workshop) — it should load todos from the backend when both servers are running and env vars are correct.

### 4. Quick verification checklist

1. **Two terminals:** Backend (`fastapi dev` in `backend/`) and frontend (`pnpm dev` or `npm run dev` in `frontend/`) run without errors.
2. **Backend:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) loads and you can execute the endpoints from the UI.
3. **Frontend ↔ backend:** With the API up, [http://localhost:3000/workshop](http://localhost:3000/workshop) fetches todos successfully (`NEXT_PUBLIC_API_URL` and backend `CORS_ORIGINS` must allow `http://localhost:3000`).


## Feedback and Contributing
At CareTech, we highly value giving and receiving constructive feedback because we know each individual's thoughts and experiences make our app better adjusted for users. 

- *If you would like to make suggestions or fixes*, feel free to make a **Pull Request** that we will review! 
- *If you would like to submit anonymous feedback*, feel free to submit your feedback through this Google Form:
  - You are also free to put your email so we can contact you: [Vitamind Feedback Form](https://docs.google.com/forms/d/1ocuDQNGvFFIDK3r0vi7DDFfK1QjMUPOIPf6J6HyYsow/edit)
 

### Authors
Made by CareTech members for the community.

- Tech Committee
- UI/UX Committee
- Projects Committee
