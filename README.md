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

## Media Architecture & CDN Conventions

### 1. YouTube Reels & Motion Media
* **Storage**: Reels store a validated 11-character YouTube video ID (`youtube_video_id`).
* **Input Flexibility**: In Django Admin, you may paste a canonical 11-character ID, a standard URL (`https://www.youtube.com/watch?v=...`), a short link (`https://youtu.be/...`), or a shorts link (`https://www.youtube.com/shorts/...`). The backend automatically sanitizes and extracts the 11-character ID.
* **Embed Security**: The API emits privacy-preserving, hardened embed URLs: `https://www.youtube-nocookie.com/embed/{youtubeVideoId}`. Raw embed HTML from clients is never accepted.
* **Poster Fallback**: If a custom poster URL is omitted or left blank, the API automatically falls back to YouTube's high-definition thumbnail: `https://img.youtube.com/vi/{youtubeVideoId}/hqdefault.jpg`.
* **Publication Rule**: Any reel with `is_published=True` strictly requires a valid YouTube video ID.

### 2. Cloudinary & External Images
* **Storage**: All still images are stored as absolute HTTPS URLs (`image_url`, `cover_image_url`, `hero_image_url`, `portrait_src`). Direct file blobs are never written to local EC2 application disk.
* **Protocol Requirement**: Insecure `http://` or non-HTTPS schemes are rejected by model validators.
* **Cloudinary Folder Conventions**: When managing assets in Cloudinary, organize assets under the following folder hierarchy:
  * `prism-pulse/portfolio/` — Still photography, motion frames, aerial captures
  * `prism-pulse/reels/` — Custom motion reel posters
  * `prism-pulse/journal/` — Article cover imagery and field notes
  * `prism-pulse/services/` — Discipline hero banners
  * `prism-pulse/about/` — Studio portraits and artist profile photos
  * `prism-pulse/site/` — Studio side image and brand assets
* **Optional Public ID**: Models include an optional `cloudinary_public_id` field (e.g. `prism-pulse/portfolio/solitude-in-svalbard`) allowing future automated transforms (e.g. `f_auto,q_auto,w_1800`) and responsive `srcset` generation.

---

## Deployment Note (Vercel)

For existing or new Vercel deployments of the frontend:
1. Open your project settings on the **Vercel Dashboard**.
2. Under **General > Root Directory**, click **Edit** and set it to:
   ```
   frontend
   ```
3. Save settings. Vercel will automatically detect the Vite preset and run `npm run build` from `frontend/`.

