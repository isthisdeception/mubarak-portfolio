# Prism Pulse — Visual Portfolio & Platform

Prism Pulse is the personal portfolio and digital platform for Mobarak — Photographer, Cinematographer, and Drone Operator. It showcases visual stories told with cinematic clarity across still imagery, motion reels, journal writings, and production service offerings.

---

## Repository Structure

```text
mubarak-portfolio/
├── frontend/             # React 19 + TypeScript + Vite SPA
│   ├── src/              # Application source code
│   ├── public/           # Static assets, icons, redirects
│   ├── index.html        # HTML entry point
│   ├── package.json      # Frontend dependencies & scripts
│   ├── vite.config.ts    # Vite bundler configuration
│   ├── vercel.json       # SPA client-side routing rewrites
│   └── tsconfig*.json    # TypeScript configurations
├── backend/              # Django + Django REST Framework API (PostgreSQL)
│   ├── manage.py         # Django CLI
│   ├── requirements.txt  # Python backend dependencies
│   ├── .env.example      # Environment variable template
│   ├── config/           # Project configuration (settings, urls, wsgi/asgi)
│   └── apps/             # Application packages
│       ├── content/      # Portfolio, reels, journal, services, site/about
│       └── inquiries/    # Contact inquiries & bookings
├── execution/            # Project execution documentation
│   └── execution.md      # Audited 10-step implementation plan
├── .gitignore            # Git ignore rules for Node, Python, and secrets
└── README.md             # Project overview and run guides
```

---

## Getting Started (Frontend)

To run the React frontend locally:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

### Other Frontend Scripts

- **Typecheck & Build:** `npm run build`
- **Lint:** `npm run lint`
- **Preview Production Build:** `npm run preview`

---

## Getting Started (Backend)

To set up and run the Django backend with PostgreSQL locally:

```bash
# Navigate to the backend directory
cd backend

# Create and activate a Python virtual environment
python -m venv .venv
# On Windows PowerShell:
.\.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create your local .env from the template
cp .env.example .env
# Edit .env with your local PostgreSQL credentials

# Run database migrations
python manage.py migrate

# Run tests
python manage.py test

# Start the development server
python manage.py runserver
```

Health check verification:
```bash
curl http://127.0.0.1:8000/api/health/
# Returns: {"status":"ok"}
```

---

## Deployment Note (Vercel)

For existing or new Vercel deployments of the frontend:
1. Open your project settings on the **Vercel Dashboard**.
2. Under **General > Root Directory**, click **Edit** and set it to:
   ```
   frontend
   ```
3. Save settings. Vercel will automatically detect the Vite preset and run `npm run build` from `frontend/`.
