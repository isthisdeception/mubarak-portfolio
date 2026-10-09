# Prism Pulse — Backend Execution Plan

> **Audience:** Antigravity (implementation agent)  
> **Deliverable of this document:** Implementation-ready, audit-based plan only.  
> **Do not implement any step while only reading this plan.** Wait for an explicit user command such as `Execute Step 01`.

---

## Antigravity Hard Rules (Non-Negotiable)

1. Execute **only** the step explicitly requested by the user.
2. Never implement future steps early.
3. Never silently combine multiple steps.
4. Inspect the current repository state before modifying files.
5. Preserve all existing working functionality (routes, design, layouts, filtering, lightbox, reel player UX, journal reading experience).
6. Do not overwrite or delete work from previous steps unnecessarily.
7. If the requested step depends on a missing prerequisite, explain the blocker rather than implementing future steps without permission.
8. Do not claim a feature is complete unless it is actually implemented and verified.
9. Do not make unrelated changes or perform unnecessary refactoring.
10. Ask for user input when a decision requires credentials, an unavailable account, a billing choice, or a genuinely unresolved architectural decision.

Every step below states its **permitted scope** and **forbidden scope**. Treat those boundaries as hard.

---

## Repository Audit Findings (Source of Truth)

Audited workspace root: `mubarak-portfolio` (GitHub remote: `https://github.com/isthisdeception/mubarak-portfolio.git`, branch `main`).  
Findings below are based on files present at planning time. Trust the repo over any assumption in the project brief if they conflict.

### Current layout (before restructuring)

```
mubarak-portfolio/          ← Git root (must remain Git root)
├── .git/
├── .gitignore
├── .oxlintrc.json
├── README.md                 ← Vite template README (not brand docs)
├── package.json              ← name: "prism-pulse-portfolio"
├── package-lock.json         ← npm lockfile present
├── vite.config.ts            ← default Vite + @vitejs/plugin-react; output defaults to dist/
├── vercel.json               ← SPA rewrite: /(.*) → /index.html
├── index.html
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── execution.md              ← OBSOLETE frontend-phase plan (gitignored); not this document
├── public/                   ← favicon, _redirects, brand assets
├── src/                      ← full React app
├── dist/                     ← build output (gitignored)
└── node_modules/             ← dependencies (gitignored)
```

**Not present:** `frontend/`, `backend/`, `execution/` (this folder is created only by the planning deliverable), Django, Python deps, `.env` / `.env.example`, API client, tests, CI workflows.

### Stack versions (from `package.json`)

| Package | Version |
|---------|---------|
| react / react-dom | ^19.2.8 |
| react-router-dom | ^7.18.4 |
| vite | ^8.3.0 |
| typescript | ~6.0.2 |
| @vitejs/plugin-react | ^6.1.1 |
| oxlint | ^1.81.0 |

**Scripts:** `dev` → `vite`; `build` → `tsc -b && vite build`; `lint` → `oxlint`; `preview` → `vite preview`.  
**Package manager:** npm (`package-lock.json`). No yarn/pnpm lockfiles.

### Routes (from `src/App.tsx`)

| Path | Page component | Dynamic content source |
|------|----------------|------------------------|
| `/` | `Home` | `src/data/home.ts` (+ local `src/assets/hero-mobarak.jpg`) |
| `/work` | `Work` | `src/data/portfolio.ts` |
| `/work/:discipline` | `WorkDiscipline` | `portfolio.ts` (`photography` \| `cinematography` \| `drone`) |
| `/reels` | `Reels` | `src/data/reels.ts` |
| `/about` | `About` | `src/data/about.ts` |
| `/services` | `Services` | `src/data/services.ts` |
| `/journal` | `Journal` | `src/data/journal.ts` |
| `/journal/:slug` | `JournalArticle` | `journal.ts` |
| `/contact` | `Contact` | `src/data/contact.ts` + client-side form |
| `*` | `NotFound` | static |

Shell: `SiteLayout` → `Navbar` + `Outlet` + `Footer` using `src/data/site.ts`.

### Where mock data lives and how it is consumed

| Domain | File | Exported types / constants | Consumed by |
|--------|------|----------------------------|-------------|
| Site chrome | `src/data/site.ts` | `SiteMetadata`, `siteData` (nav, social, brand) | `Navbar`, `Footer` |
| Home | `src/data/home.ts` | `HomeData`, `SelectedWorkItem`, `homeData` | `Home` |
| Portfolio | `src/data/portfolio.ts` | `DisciplineId`, `PortfolioItem`, `DisciplineMeta`, `disciplinesData`, `portfolioItems` | `Work`, `WorkDiscipline`, cards, lightbox |
| Reels | `src/data/reels.ts` | `ReelCategory`, `ReelItem`, `reelCategories`, `reelsData` | `Reels`, reel components |
| About | `src/data/about.ts` | `AboutData`, `aboutData` | `About` |
| Services | `src/data/services.ts` | `ServicesPageData`, `ServiceGroup`, `ServiceItem`, `servicesData` | `Services`, `contact.ts` (service options) |
| Journal | `src/data/journal.ts` | `JournalCategory`, `JournalPost`, `journalCategories`, `journalPosts` | `Journal`, `JournalArticle` |
| Contact copy | `src/data/contact.ts` | `ContactData`, `contactData` | `Contact` |

**No API client exists.** Grep found no `fetch`, axios, `import.meta.env`, or `VITE_*` usage.

### Portfolio behavior (important for models)

- A **portfolio item is a single media record**, not a multi-image gallery project.
- Fields: `id`, `title`, `discipline`, `category`, `mediaType` (`image` \| `video`), `src`, `alt`, `aspectRatio`, `year`, `location`, optional `clientOrContext`, optional `description`.
- Filtering is client-side by `discipline` and `category` string.
- Lightbox (`Lightbox.tsx`) always renders an `<img src={item.src}>`. For `mediaType === 'video'`, it only shows a CTA link to `/reels` — it does **not** play video.
- Discipline metadata (`disciplinesData`) includes `heroImage`, tagline, description, and an ordered `categories[]` list used by filters.

### Reels behavior — discrepancy with YouTube brief

- Current player (`ReelPlayerModal.tsx`) uses native HTML5 `<video src={reel.videoSrc}>` with MDN sample MP4 URLs.
- Fields: `id`, `title`, `category`, `poster`, `videoSrc`, `duration`, `aspectRatio` (`vertical` \| `cinematic`), `year`, `location`, optional `gearOrFormat`, `description`.
- **Planned target:** store YouTube IDs/URLs in PostgreSQL and embed via YouTube iframe (Step 06 + Step 08). Do not assume YouTube is already integrated.

### Journal structure

- List + detail by `slug`.
- Nested `content`: `introParagraph`, optional `quote` / `quoteAuthor`, `bodyParagraphs[]`, optional `technicalNote`, optional `takeaway`.
- Categories are fixed string unions in TS; filtering is client-side.
- Featured entry on list page = first item in filtered array (no separate featured flag today).

### Services / About / Contact

- Services: page-level copy + 3 discipline groups, each with nested service offerings (`id`, `name`, `description`, optional `deliverables`).
- About: nested portrait, intro, philosophy tenets, skills list, equipment categories/items, professional notes.
- Contact form fields (actual UI):  
  **Required:** `name`, `email`, `service`, `message` (min 10 chars).  
  **Optional:** `phone`, `date` (`type="date"`), `location`.  
  Submission is **simulated** with `setTimeout` (~850ms); nothing is persisted.

### Media sources today

- Portfolio / journal / about / services / reel posters: **Unsplash remote URLs** (placeholders, not permanent creator assets).
- Home hero: **local bundler asset** `src/assets/hero-mobarak.jpg` (also duplicated under `public/`).
- Reel videos: **external MP4 demos**, not YouTube.
- **No Cloudinary**, no upload pipeline, no Django media serving.

### Deployment / env / Git

- `vercel.json` SPA rewrite exists at repo root; framework is Vite; build output is default `dist`.
- `public/_redirects` contains Netlify-style SPA fallback.
- `.gitignore` ignores `node_modules`, `dist`, logs, editor files, and **`execution.md`** (root obsolete plan). It does **not** yet ignore Python venvs, `.env`, or `__pycache__`.
- No `.env` / `.env.example`.
- README is still the Vite starter text.

### Tests

- No frontend test runner configured.
- No backend tests (no backend).

---

## Target Repository Structure

```
prism-pulse/   (or current folder name mubarak-portfolio — do not rename the Git root unless user asks)
├── frontend/
│   ├── src/                  ← existing src/ moved intact
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   ├── tsconfig*.json
│   ├── vercel.json
│   ├── .oxlintrc.json
│   └── ...
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── config/               ← Django project package
│   ├── apps/
│   │   ├── content/          ← portfolio, reels, journal, services, site/about
│   │   └── inquiries/        ← contact submissions
│   └── ...
├── execution/
│   └── execution.md          ← this file
├── .gitignore                ← root, expanded for Python/secrets
└── README.md                 ← project-level docs (updated in Step 01 / refined later)
```

Preserve Git metadata at repository root. Avoid monorepo tooling (no Turborepo/Nx). One npm lockfile under `frontend/` only. One Python `requirements.txt` under `backend/` only.

---

## Architectural Decisions (Resolved from Audit)

### A1. Django apps (lean)

| App | Responsibility |
|-----|----------------|
| `config` | Settings, URLs, WSGI/ASGI, CORS, DRF defaults |
| `apps.content` | All published CMS content + site/about/services |
| `apps.inquiries` | Contact / booking inquiry persistence |

Do not create one app per page.

### A2. Models mapped to frontend shapes

Models are designed to serialize into JSON that matches (or is a thin, documented superset of) the existing TypeScript interfaces so React changes stay small.

| Model | Purpose | Key fields / relations |
|-------|---------|------------------------|
| `Discipline` | Photography / Cinematography / Drone chapter metadata | `id` slug (`photography`…), `name`, `tagline`, `description`, `hero_image_url`, `hero_image_alt`, `sort_order`, `is_published` |
| `PortfolioCategory` | Filter category belonging to a discipline | FK `discipline`, `name`, `slug`, `sort_order` |
| `PortfolioItem` | Single still/motion-poster entry (matches `PortfolioItem`) | `slug` (maps to frontend `id`), `title`, FK discipline, FK category, `media_type` (`image`/`video`), `image_url` (maps to `src`), optional `cloudinary_public_id`, `alt`, `aspect_ratio`, `year`, `location`, `client_or_context`, `description`, `is_featured`, `featured_order`, `sort_order`, `is_published`, timestamps |
| `Reel` | Short-form motion item | `slug`, `title`, FK/category string, `poster_url`, `youtube_video_id`, `duration`, `aspect_ratio`, `year`, `location`, `gear_or_format`, `description`, `sort_order`, `is_published` |
| `JournalPost` | Article | `slug`, `title`, `category`, `published_at`, `read_time`, `excerpt`, `cover_image_url`, `cover_alt`, `location`, content fields (`intro_paragraph`, `quote`, `quote_author`, `body_paragraphs` JSON list, `technical_note`, `takeaway`), `is_published`, `sort_order` |
| `ServiceGroup` | Services page discipline block | `id` slug, `number`, `discipline` label, `tagline`, `description`, `hero_image_url`, `image_alt`, `sort_order`, `is_published` |
| `ServiceOffering` | Nested service | FK group, `slug`, `name`, `description`, `deliverables`, `sort_order`, `is_published` |
| `SiteSettings` | Singleton site chrome + contact sidebar | brand fields, tagline, location, copyright year strategy, contact email/phone/representation/hours/response note, contact side image, home hero fields (or separate), social links as related rows |
| `SocialLink` | Footer/social | FK/settings M2O or standalone ordered list: `platform`, `url`, `handle`, `sort_order` |
| `AboutProfile` | Singleton about page | name, role, portrait fields, intro headline/paragraphs (JSON), philosophy title/statement |
| `PhilosophyTenet` | About tenets | FK about, `number`, `title`, `description`, `sort_order` |
| `Skill` | About skills | FK about, `label`, `sort_order` |
| `EquipmentCategory` / `EquipmentItem` | Gear lists | category `group` name; items text + order |
| `ProfessionalNote` | About notes | `label`, `value`, `sort_order` |
| `HomeSelectedWork` **or** featured flags on `PortfolioItem` | Home selected works | **Decision:** use `PortfolioItem.is_featured` + `featured_order` + API shape adapter to `SelectedWorkItem` (includes `linkTarget` computed as `/work/{discipline}?item={slug}`) |
| `ContactInquiry` | Booking form submissions | `name`, `email`, `phone`, `service`, `project_date`, `location`, `message`, `created_at`, `ip_address` (optional), `user_agent` (optional), `status` (`new`/`read`/`archived`) |

**Validation highlights**

- Slugs: unique, URL-safe, stable (frontend deep links use `?item=<id>` and `/journal/:slug` and `?play=<id>`).
- Public API returns only `is_published=True`.
- YouTube IDs: validate `^[A-Za-z0-9_-]{11}$` (or extract from canonical URL in admin `clean()`); never trust raw embed URL strings from clients.
- Contact: mirror frontend required rules; enforce max lengths server-side; never expose inquiry list publicly.

### A3. API contract (stable for frontend)

Base path: `/api/`. Trailing slash: Django default (enable trailing slashes; frontend client must append them).

All public GET endpoints: `AllowAny`, read-only.  
`POST /api/contact/`: `AllowAny` with throttling.  
Admin: session auth at `/admin/` only. No public user accounts.

#### Response envelope

Prefer **direct resource JSON** matching frontend types (not a nested `{data: ...}` wrapper) to minimize frontend adapters. Errors:

```json
{ "detail": "Not found." }
```

Validation errors (DRF style):

```json
{ "email": ["Enter a valid email address."], "message": ["Ensure this field has at least 10 characters."] }
```

#### Endpoints

| Method | Path | Purpose | Auth | Query / body | Response shape |
|--------|------|---------|------|--------------|----------------|
| GET | `/api/health/` | Liveness | public | — | `{ "status": "ok" }` |
| GET | `/api/disciplines/` | Discipline chapters + categories | public | — | Array of `DisciplineMeta`-compatible objects |
| GET | `/api/portfolio/` | Portfolio items | public | `discipline`, `category`, `featured` | Array of `PortfolioItem`-compatible (`id` = slug) |
| GET | `/api/portfolio/{slug}/` | Single item | public | — | One item or 404 |
| GET | `/api/reels/` | Reels list | public | `category` | Array; include `youtubeVideoId`, `embedUrl`, `poster` (keep `videoSrc` optional/null during transition only if needed — prefer new fields and update UI in Step 08) |
| GET | `/api/reels/{slug}/` | Single reel | public | — | One reel or 404 |
| GET | `/api/journal/` | Journal list (no full body required) | public | `category` | Array of list cards (`slug`, `title`, `category`, `date`, `readTime`, `excerpt`, `coverImage`, `coverAlt`, `location`) |
| GET | `/api/journal/{slug}/` | Full article | public | — | Full `JournalPost` including `content` |
| GET | `/api/services/` | Services page payload | public | — | `ServicesPageData`-compatible object |
| GET | `/api/about/` | About page payload | public | — | `AboutData`-compatible object |
| GET | `/api/site/` | Site chrome + contact sidebar fields needed by Navbar/Footer/Contact | public | — | Combines `siteData` + contact studio fields (document exact keys in serializer) |
| GET | `/api/home/` | Home page payload | public | — | `HomeData`-compatible; `selectedWorks` from featured portfolio items; hero may use URL or keep frontend local asset until CMS provides URL |
| POST | `/api/contact/` | Create inquiry | public + throttle | JSON body below | `201` `{ "ok": true, "id": "<uuid-or-int>" }` |

**Contact body**

```json
{
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string (optional)",
  "service": "string (required)",
  "date": "YYYY-MM-DD or empty (optional)",
  "location": "string (optional)",
  "message": "string (required, min 10)"
}
```

**Pagination:** Not required for v1 (current mock volumes are small: ~14 portfolio, ~10 reels, ~6 journal). If lists grow, add DRF pagination later without breaking clients by introducing it behind a documented change — do not add pagination in Steps 01–08 unless lists exceed ~100.

**Filtering:** Server supports the query params listed; frontend may still filter client-side initially in Step 07, then prefer server filters where already used.

### A4. Media architecture

| Media | Strategy |
|-------|----------|
| Portfolio / journal / about / services images | Store absolute HTTPS `image_url` (Cloudinary or any CDN). Optional `cloudinary_public_id` for future transforms. Admin pastes URLs — **no upload API in v1**. |
| Home hero | Prefer CMS URL when available; until then frontend may keep bundling `hero-mobarak.jpg`. |
| Portfolio “video” items | Remain poster images in lightbox (current UX). Optional `youtube_video_id` field may be added later; not required to match current UI. |
| Reels | YouTube: store `youtube_video_id`; API exposes safe `embedUrl` = `https://www.youtube-nocookie.com/embed/{id}`. Poster from YouTube or stored `poster_url`. |
| Django MEDIA_ROOT | Not used for portfolio binaries. Static files only for Admin/CSS collected assets. |

Do not use Unsplash/Pexels as the permanent production source; seed may temporarily reuse current placeholder URLs for local QA.

### A5. Security / config (portable EC2 → Render)

Environment-driven (never hardcode hosts):

- `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `DATABASE_URL` or discrete `POSTGRES_*`
- `CORS_ALLOWED_ORIGINS` (Vercel production + `http://localhost:5173`)
- `CSRF_TRUSTED_ORIGINS` for admin over HTTPS
- `DJANGO_SUPERUSER_*` optional for bootstrap scripts — prefer manual `createsuperuser` for learning

Production: HTTPS via Nginx + Certbot on EC2; `SECURE_*` flags when `DEBUG=False`.  
DRF throttle contact endpoint (e.g. `AnonRateThrottle` scoped `5/hour` or similar).  
No Django secrets in `VITE_*` vars.

### A6. Vercel (mandatory after move)

After Step 01, Vercel project settings (dashboard, **manual user action**):

| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` (or `npm ci`) |

Agent cannot change the Vercel dashboard. Preserve `frontend/vercel.json` SPA rewrites. Document the dashboard update in the Step 01 completion report.

### A7. Unresolved decisions requiring user input (do not block coding on guesses)

Flag and ask when the step needs them:

1. **PostgreSQL local credentials** and whether Docker Postgres is preferred vs local install.
2. **Cloudinary account** vs plain CDN URLs for production images.
3. **YouTube channel / video IDs** for real reels (seed can use placeholders).
4. **EC2 instance size / region / domain / DNS** and whether Postgres is on-box vs managed.
5. **Production CORS origin** (exact Vercel URL).
6. Whether contact **email notifications** are desired in v1 (default: **no**, Admin-only).

---

## Exactly 10 Execution Steps

---

# Step 01 — Repository Restructuring and Frontend Preservation

### Objective

Safely reorganize the repository into `frontend/`, `backend/`, and `execution/` at the Git root without breaking the React app, design, local scripts, or Vercel deployability.

### Repository Preconditions

- Working tree should be clean or only contain this plan under `execution/`.
- Current app files live at repository root (`src/`, `package.json`, `vite.config.ts`, etc.).
- No `frontend/` or `backend/` directories yet (create them here).

### Scope

**Permitted**

- Create `frontend/`, `backend/` (minimal scaffold placeholders only), keep `execution/`.
- Move all frontend-owned files into `frontend/` (listed below).
- Update root `.gitignore` for monorepo (Node + Python + secrets).
- Update root `README.md` with high-level structure and how to run frontend from `frontend/`.
- Relocate obsolete root `execution.md` into `execution/archive/frontend-phase-execution.md` (optional but recommended) and stop gitignoring the new plan path.
- Ensure `frontend` still builds and serves.
- Add empty `backend/.gitkeep` or a one-line README stub only if needed so the folder exists — **do not** run `django-admin startproject` in this step.

**Forbidden**

- Django project creation, models, APIs, dependency installs for Python.
- Frontend feature changes, design rewrites, mock data removal.
- Changing Vercel dashboard (document manual action only).
- Introducing monorepo build tools.

### Detailed Implementation Tasks

1. Inspect `git status` and current root file list.
2. Create `frontend/` and move into it:
   - `src/`, `public/`, `index.html`
   - `package.json`, `package-lock.json`
   - `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
   - `vercel.json`, `.oxlintrc.json`
   - Any other frontend-only config present at root
3. Keep at root: `.git/`, `.gitignore`, `README.md`, `execution/`, and new `backend/`.
4. Do **not** move `node_modules/` or `dist/`; delete them at root if left behind and reinstall inside `frontend/` (`npm install`).
5. Expand root `.gitignore`:
   - Keep ignoring `node_modules/`, `dist/`, logs, editor junk
   - Add: `.env`, `.env.*` (except `!.env.example`), `venv/`, `.venv/`, `__pycache__/`, `*.pyc`, `db.sqlite3`, `.pytest_cache/`, `staticfiles/`, media uploads if any
   - Remove blanket ignore of `execution.md` **or** narrow it so `execution/execution.md` is trackable; archive the old frontend plan under `execution/archive/`
6. Rewrite root `README.md` briefly: project name Prism Pulse, structure, `cd frontend && npm install && npm run dev`, note backend arrives in later steps, Vercel Root Directory = `frontend`.
7. Verify `frontend/vercel.json` still contains SPA rewrites.
8. Do not change application source paths inside `src` beyond what the move requires (imports are relative within `src` — should keep working).

### Files and Directories Affected

- Moves: all current frontend root files → `frontend/`
- Create: `frontend/`, `backend/` (empty scaffold), `execution/` (already has this plan)
- Update: `.gitignore`, `README.md`
- Possibly: archive obsolete `execution.md`

### Expected Deliverables

- Runnable React app exclusively under `frontend/`
- Empty-but-present `backend/` ready for Step 02
- Trackable `execution/execution.md`
- Documented Vercel Root Directory instruction for the user

### Design and Compatibility Requirements

- Zero visual or route changes.
- Preserve `react-router-dom` routes and all CSS.
- Preserve local assets (`hero-mobarak.jpg`, favicons).

### Explicitly Out of Scope

- Django, PostgreSQL, API, env examples for backend, frontend API wiring.

### Dependencies and Prerequisites

- Node.js + npm available locally.
- User will update Vercel dashboard Root Directory after push (manual).

### Acceptance Criteria

- [ ] `cd frontend && npm install && npm run build` succeeds.
- [ ] `npm run dev` serves the site; routes `/`, `/work`, `/reels`, `/about`, `/services`, `/journal`, `/contact` render.
- [ ] Git root still contains `.git`.
- [ ] No secrets committed.
- [ ] `execution/execution.md` remains at repo root `execution/`.

### Local Verification

```bash
cd frontend
npm install
npm run lint
npm run build
npm run dev
```

- Report the actual Vite localhost URL (do not assume port 5173).
- Spot-check desktop and mobile nav.
- Confirm no broken asset paths for hero/favicon.

### Regression Checks

- Deep links: `/work/photography?item=solitude-in-svalbard`, `/journal/arctic-light-svalbard`, `/reels?play=alps-in-cloudbreak`.
- Contact form still simulates submit.
- Lightbox and reel modal still open.

### Completion Report

Include: step id; files moved/created/removed; commands; build/dev results; localhost URL; Vercel manual action for user; confirmation that Steps 02–10 were not started.

---

# Step 02 — Django Foundation and Environment Configuration

### Objective

Create the Django + DRF project under `backend/` with PostgreSQL configuration via environment variables, CORS for the Vite origin, split-friendly settings, and a public health endpoint.

### Repository Preconditions

- Step 01 complete: `frontend/` works; `backend/` exists; plan present.
- User can provide local Postgres connection info (ask if missing).

### Scope

**Permitted**

- Python venv under `backend/.venv` (gitignored).
- `requirements.txt` with pinned-or-compatible versions: `Django`, `djangorestframework`, `django-cors-headers`, `psycopg` (or `psycopg2-binary`), `python-dotenv`, `gunicorn` (include now for later deploy; unused until Step 10).
- `django-admin startproject config .` inside `backend/` (or equivalent layout with `manage.py` at `backend/manage.py`).
- Create app packages `apps/content` and `apps/inquiries` (empty models ok).
- Settings: `DEBUG`, `SECRET_KEY`, `ALLOWED_HOSTS`, database from env, `INSTALLED_APPS`, DRF defaults, CORS, `TIME_ZONE`, `USE_TZ`.
- `backend/.env.example` with placeholders only.
- Local `.env` (gitignored) for development.
- URL route `GET /api/health/`.
- Minimal smoke test for health endpoint.

**Forbidden**

- Domain models/migrations beyond app scaffold.
- Contact endpoint, serializers for content, frontend changes, EC2 deployment, Cloudinary SDK.

### Detailed Implementation Tasks

1. Create venv; install deps; freeze or hand-maintain `requirements.txt`.
2. Start Django project `config` in `backend/`.
3. Package layout:

   ```
   backend/
     manage.py
     requirements.txt
     .env.example
     config/
       __init__.py
       settings.py   # or settings/base.py + local.py — keep simple unless split helps
       urls.py
       wsgi.py
       asgi.py
     apps/
       __init__.py
       content/
       inquiries/
   ```

4. Configure Postgres (no SQLite for the default/dev path intended to mirror production). If Postgres is unavailable, **stop and ask the user** rather than silently switching production architecture to SQLite. A temporary local SQLite escape hatch may be documented only if the user explicitly approves for offline coding — default plan is PostgreSQL.
5. Add `corsheaders` middleware; allow `http://localhost:5173` and `http://127.0.0.1:5173` via env list.
6. Implement health view + test.
7. Document run commands in root or `backend` README section (short).

### Files and Directories Affected

- `backend/**` (new Django project)
- Root `.gitignore` only if additional Python paths needed
- Possibly root `README.md` run instructions

### Expected Deliverables

- `python manage.py runserver` works against Postgres
- `GET /api/health/` → `{"status":"ok"}`
- `.env.example` committed; `.env` not committed

### Design and Compatibility Requirements

- No frontend edits required in this step.
- Portable settings (Render-friendly): prefer `DATABASE_URL` parsing **or** discrete vars — pick one approach and document it; avoid AWS-only APIs.

### Explicitly Out of Scope

- Models, admin customization, content APIs, contact POST, media, Gunicorn/Nginx.

### Dependencies and Prerequisites

- Step 01 done.
- PostgreSQL running locally (user-provided).

### Acceptance Criteria

- [ ] Migrations for built-in apps apply on Postgres.
- [ ] Health endpoint returns 200.
- [ ] CORS middleware installed (full CORS verification with browser comes when frontend calls API).
- [ ] `python manage.py test` passes for health test.

### Local Verification

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# Unix: source .venv/bin/activate
pip install -r requirements.txt
# ensure .env exists (copied from example, filled by user)
python manage.py migrate
python manage.py runserver
# other terminal:
curl http://127.0.0.1:8000/api/health/
python manage.py test
```

Also keep frontend runnable (`cd frontend && npm run dev`) to prove Step 01 still holds — no API wiring yet.

### Regression Checks

- Frontend still builds independently.
- No secrets in git (`git status` clean of `.env`).

### Completion Report

Step 02 report with env vars required from user, DB connection verified, health URL, tests, confirmation that models/API content were not implemented.

---

# Step 03 — Database Models, Migrations, and Django Admin

### Objective

Implement the audited domain models, relationships, migrations, Admin UX for content management, and a minimal seed strategy for local testing.

### Repository Preconditions

- Step 02 complete: Django runs; Postgres migrates; health works.

### Scope

**Permitted**

- All models listed in Architecture A2 inside `apps.content` and `apps.inquiries`.
- Migrations.
- Django Admin registration with list displays, filters, search, ordering, prepopulated slugs where helpful.
- Management command or fixture JSON to seed from current mock data shapes (Unsplash URLs allowed as temporary seed).
- Model-level `clean()` / constraints for YouTube ID format (even if seed still transitioning), unique slugs, singleton `SiteSettings` / `AboutProfile` pattern.

**Forbidden**

- Public API serializers/views (Step 04).
- Contact POST endpoint behavior beyond model existence (Step 05).
- Frontend integration.
- Media upload widgets to Cloudinary.
- Custom admin dashboards.

### Detailed Implementation Tasks

1. Implement models with field types aligned to TS:
   - Prefer `slug` as the public identifier serialized as `id` for portfolio/reels.
   - `aspect_ratio` / `media_type` / reel categories / journal categories as `CharField` + choices matching frontend unions.
   - `body_paragraphs` as `JSONField` (list of strings).
   - `intro` paragraphs for about as `JSONField` list.
2. Add indexes on (`discipline`, `is_published`), (`slug`,), (`category`,).
3. Admin: make inquiry model read-mostly (no need for rich editing of spam); mark `created_at` readonly.
4. Seed command e.g. `python manage.py seed_content` that is idempotent (update_or_create by slug).
5. Create superuser instructions (manual) — do not commit credentials.
6. Write model/admin unit tests for constraints (unique slug, published default, youtube id validator).

### Files and Directories Affected

- `backend/apps/content/**`
- `backend/apps/inquiries/**`
- `backend/config/settings.py` (`INSTALLED_APPS` already done)
- New migration files
- Optional `backend/apps/content/management/commands/seed_content.py`

### Expected Deliverables

- Migrated schema on Postgres
- Admin usable for CRUD of portfolio, reels, journal, services, about, site, inquiries
- Seed loads enough rows to exercise later API tests

### Design and Compatibility Requirements

- Model field names may be Pythonic (`image_url`); serializers in Step 04 camelCase to match frontend (`imageUrl` / `src` mapping documented there).
- Do not invent multi-image gallery tables — frontend has no gallery project entity.

### Explicitly Out of Scope

- DRF viewsets, routers, frontend, deployment, Cloudinary uploads.

### Dependencies and Prerequisites

- Step 02.
- User approval if any schema doubt remains (default: follow A2).

### Acceptance Criteria

- [ ] `python manage.py makemigrations` / `migrate` succeed.
- [ ] Admin login works; can create a `PortfolioItem` and see it listed.
- [ ] Seed command runs twice without duplicating slugs.
- [ ] Model tests pass.

### Local Verification

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py seed_content
python manage.py createsuperuser   # interactive; user provides values
python manage.py runserver
# open http://127.0.0.1:8000/admin/
python manage.py test
```

### Regression Checks

- Health endpoint still OK.
- Frontend untouched and still builds.

### Completion Report

List models created, migration names, seed counts, admin URLs, tests; confirm APIs not exposed yet.

---

# Step 04 — Public API and Content Serializers

### Objective

Expose read-only DRF endpoints and serializers that match the API contract in A3 for all published content (excluding contact POST).

### Repository Preconditions

- Step 03 complete with seeded content.

### Scope

**Permitted**

- Serializers (camelCase JSON keys matching frontend interfaces).
- Viewsets/APIViews + router registration under `/api/`.
- Filters: discipline, category, featured.
- Permissions: read-only public for content.
- API tests: list/detail, 404, unpublished hidden, filter behavior.
- OpenAPI optional — **skip** unless already trivial; do not add Spectacular unless needed.

**Forbidden**

- Contact POST (Step 05).
- Frontend wiring (Steps 07–08).
- Changing models except tiny serializer-driven fixes that are required and safe.
- Authentication for public users.

### Detailed Implementation Tasks

1. Map serializer output carefully:
   - Portfolio: `id` ← `slug`; `src` ← `image_url`; `mediaType` ← `media_type`; etc.
   - Disciplines: include nested `categories: string[]` in the order of `sort_order`.
   - Journal list vs detail: list omits heavy `content` or includes excerpt only; detail includes full `content` object.
   - Home: compose `selectedWorks` with computed `linkTarget`.
   - Reels: expose `youtubeVideoId`, `embedUrl`, `poster` (and `duration`, etc.). May omit obsolete `videoSrc` or set null — document choice for Step 08.
2. Ensure unpublished rows never appear.
3. Consistent 404 for unknown slugs.
4. Register urls in `config/urls.py`.

### Files and Directories Affected

- `backend/apps/content/serializers.py`, `views.py`, `urls.py`, `tests/`
- `backend/config/urls.py`

### Expected Deliverables

- All GET endpoints from A3 except those deferred: health (done), content GETs done; contact POST not yet.
- Test suite covering serializers/endpoints.

### Design and Compatibility Requirements

- Stable contract: treat A3 as frozen for Steps 07–08.
- No pagination unless absolutely necessary.

### Explicitly Out of Scope

- Contact POST, throttling beyond global defaults (contact-specific in Step 05), frontend, EC2.

### Dependencies and Prerequisites

- Seeded DB from Step 03.

### Acceptance Criteria

- [ ] Each GET endpoint returns 200 with shape compatible with corresponding TS interface.
- [ ] Unpublished content excluded.
- [ ] Filters work.
- [ ] Tests pass.

### Local Verification

```bash
cd backend
python manage.py runserver
curl http://127.0.0.1:8000/api/portfolio/
curl http://127.0.0.1:8000/api/disciplines/
curl http://127.0.0.1:8000/api/reels/
curl http://127.0.0.1:8000/api/journal/
curl http://127.0.0.1:8000/api/journal/arctic-light-svalbard/
curl http://127.0.0.1:8000/api/services/
curl http://127.0.0.1:8000/api/about/
curl http://127.0.0.1:8000/api/site/
curl http://127.0.0.1:8000/api/home/
python manage.py test
```

### Regression Checks

- Admin still works.
- Health still works.
- Frontend still on mocks (unchanged).

### Completion Report

Enumerate endpoints verified with sample response keys; note any intentional deviations from TS (and why); confirm contact POST not implemented.

---

# Step 05 — Contact / Booking Backend

### Objective

Implement `POST /api/contact/` with server-side validation, Postgres persistence, Admin visibility, and spam/throttle mitigation. No payment or accounts.

### Repository Preconditions

- Steps 02–04 complete (`ContactInquiry` model exists; API router in place).

### Scope

**Permitted**

- Serializer + create view for contact fields matching `Contact.tsx`.
- Validation: required name/email/service/message; email format; message min length 10; max lengths; optional phone/date/location; date parse `YYYY-MM-DD` or omit.
- Save to `ContactInquiry`; return `201` contract from A3.
- DRF throttling scoped to contact (document rate).
- Admin list filters by status/date; readonly timestamps.
- Tests: valid create, invalid payloads, throttle smoke if practical.
- Optional honeypot field only if it does not break the existing frontend contract — prefer pure throttle + validation in v1.

**Forbidden**

- Email delivery (unless user explicitly requests; default off).
- Frontend submit wiring (Step 08).
- Public GET of inquiries.
- File uploads.

### Detailed Implementation Tasks

1. Implement `ContactInquirySerializer` / `CreateAPIView`.
2. Map JSON `date` → `project_date`.
3. Capture IP/UA optionally from request for abuse forensics (do not display publicly).
4. Ensure CSRF: if using session auth not required for tokenless JSON API from Vite origin, use standard DRF APIView (exempt from CSRF like other DRF APIs). Do not disable CSRF globally for Admin.
5. Document response handling for frontend.

### Files and Directories Affected

- `backend/apps/inquiries/**`
- `backend/config/settings.py` (throttle rates)
- Tests

### Expected Deliverables

- Working POST endpoint + Admin inquiry review + tests

### Design and Compatibility Requirements

- Error shape must be mappable to existing form field errors in Step 08.
- Success response must support existing success receipt UI.

### Explicitly Out of Scope

- Frontend `fetch` integration, newsletter, CRM, Slack webhooks, email.

### Dependencies and Prerequisites

- Step 03 model + Step 04 URL patterns style.

### Acceptance Criteria

- [ ] Valid POST creates DB row visible in Admin.
- [ ] Invalid POST returns 400 with field errors.
- [ ] No public list endpoint.
- [ ] Throttle configuration present.
- [ ] Tests pass.

### Local Verification

```bash
curl -X POST http://127.0.0.1:8000/api/contact/ \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test\",\"email\":\"test@example.com\",\"service\":\"Photography: Portrait Sessions\",\"message\":\"Looking to book a session next month.\"}"
python manage.py test apps.inquiries
```

Verify row in `/admin/`.

### Regression Checks

- Content GET endpoints still pass tests.
- Frontend still simulated submit (unchanged).

### Completion Report

Include sample success/error JSON, throttle limits, confirmation email not implemented, no frontend wiring yet.

---

# Step 06 — External Media Integration

### Objective

Finalize backend media representation for YouTube reels and external/Cloudinary image URLs; ensure serializers emit safe embed metadata. No upload system.

### Repository Preconditions

- Steps 03–04 done (models + serializers exist). Adjust fields if Step 03 left TODOs for YouTube.

### Scope

**Permitted**

- Harden YouTube ID validation and `embedUrl` generation (`youtube-nocookie.com`).
- Image URL fields + optional `cloudinary_public_id`; document how Admin should paste Cloudinary secure URLs.
- Update seed data: replace MDN MP4 `videoSrc` concept with YouTube IDs (placeholder IDs allowed for local QA — **ask user** for real IDs if available).
- Serializer fields for posters/thumbnails.
- Tests for reject invalid YouTube IDs; embed URL safety (no arbitrary javascript URLs).
- Minimal backend helper utilities (e.g. `extract_youtube_id`).

**Forbidden**

- Building Cloudinary upload UI/API.
- Rewriting frontend player (Step 08) — except if a tiny shared type comment is needed; prefer backend-only here.
- Storing video blobs on EC2 disk.
- Paying for CDN tiers without user approval.

### Detailed Implementation Tasks

1. Confirm `Reel.youtube_video_id` required for published reels.
2. API response includes:
   - `youtubeVideoId`
   - `embedUrl`
   - `poster` (stored URL; optionally default to YouTube hqdefault if poster empty — document behavior)
3. Portfolio/journal images remain URL strings; add README note for Cloudinary folder conventions (public IDs optional).
4. Remove any seed dependency on MP4 `videoSrc` for API output.
5. Do not delete frontend mock MP4 usage yet (still Step 08).

### Files and Directories Affected

- `backend/apps/content/models.py` (if field tweaks needed)
- Serializers, validators, seed command, tests
- `backend/.env.example` only if Cloudinary cloud name is needed later (optional; not required if using full URLs)

### Expected Deliverables

- Safe media JSON contract finalized
- Seeded reels playable via YouTube embed URLs when frontend is updated next

### Design and Compatibility Requirements

- Frontend visual design unchanged in this step.
- Keep image URL replaceable without schema redesign.

### Explicitly Out of Scope

- React `ReelPlayerModal` iframe swap (Step 08).
- Production Cloudinary account setup (user action).

### Dependencies and Prerequisites

- Step 04 serializers.
- User-provided YouTube IDs preferred; placeholders acceptable with documented limitation.

### Acceptance Criteria

- [ ] Invalid YouTube IDs rejected on model/serializer validation.
- [ ] `embedUrl` always built from validated ID, never from raw user embed HTML.
- [ ] Image responses are HTTPS URLs.
- [ ] Tests pass.

### Local Verification

```bash
curl http://127.0.0.1:8000/api/reels/ | jq
python manage.py test
```

Manually open an `embedUrl` in browser to confirm YouTube serves it (if network allows).

### Regression Checks

- Portfolio image URLs still returned.
- Contact endpoint unaffected.

### Completion Report

Document media contract, placeholder vs real YouTube IDs, any user actions for Cloudinary; confirm frontend not yet switched.

---

# Step 07 — Frontend API Client and Portfolio Integration

### Objective

Add a typed API client and `VITE_API_BASE_URL`, then connect **portfolio-related** pages to the backend while preserving design, filters, and lightbox behavior.

### Repository Preconditions

- Backend Steps 02–06 done; portfolio/discipline/home endpoints verified via curl.
- Frontend still on mocks.

### Scope

**Permitted**

- `frontend/.env.example` with `VITE_API_BASE_URL=http://127.0.0.1:8000/api`
- `frontend/src/lib/api.ts` (or `src/api/client.ts`) — fetch wrapper, error types, typed getters.
- TypeScript types for API responses (can re-export/adapt from existing `src/data/portfolio.ts` types).
- Update `Work.tsx`, `WorkDiscipline.tsx`, and portfolio components’ data loading to use API.
- Optionally wire `Home` selected works via `/api/home/` or `/api/portfolio/?featured=true` if needed for consistency.
- Loading / error / empty states that fit existing CSS (no redesign).
- Keep mock modules present as fallback **or** behind a clear dead-code retention until Step 08 finishes — do not delete mock files yet.

**Forbidden**

- Rewriting CSS/layout.
- Integrating reels/about/services/journal/contact (Step 08).
- Removing mock data files entirely.
- Exposing secrets via `VITE_*`.

### Detailed Implementation Tasks

1. Create API client:

   ```ts
   const BASE = import.meta.env.VITE_API_BASE_URL;
   ```

2. Fetch disciplines + portfolio items; map into existing filter logic (`useMemo` filters may remain client-side on fetched arrays).
3. Preserve URL lightbox param `?item=<slug>`.
4. Handle fetch errors with a calm inline message (match typography tokens).
5. Ensure CORS works with both servers running; fix backend CORS env if needed (allowed in this step as integration fix).
6. `npm run build` must pass.

### Files and Directories Affected

- `frontend/src/lib/**` or `frontend/src/api/**` (new)
- `frontend/src/pages/Work.tsx`, `WorkDiscipline.tsx`, possibly `Home.tsx`
- `frontend/.env.example`, local `frontend/.env` (gitignored)
- Possibly minor backend CORS env docs if mismatch found

### Expected Deliverables

- Portfolio hub + discipline pages driven by API
- Documented env var for local + Vercel

### Design and Compatibility Requirements

- Visual design unchanged.
- Filtering UX unchanged.
- Lightbox unchanged except data source.

### Explicitly Out of Scope

- Reels YouTube player swap, journal/services/about/contact API wiring, mock file deletion, EC2.

### Dependencies and Prerequisites

- Backend running with seeded portfolio data.
- CORS allows Vite origin.

### Acceptance Criteria

- [ ] With backend down, UI shows error state (not a blank crash).
- [ ] With backend up, items render; filters work; lightbox works; deep links work.
- [ ] `npm run build` succeeds.
- [ ] No Django secrets in frontend env.

### Local Verification

```bash
# terminal 1
cd backend && python manage.py runserver
# terminal 2
cd frontend && npm run dev
```

- Verify Network tab calls `/api/portfolio/` and `/api/disciplines/`.
- Check `/work`, `/work/photography`, lightbox navigation.
- Desktop + mobile gallery sanity check.

### Regression Checks

- Unmigrated pages (reels, journal, etc.) still work on mocks.
- Navbar/Footer still work.

### Completion Report

List files changed; env vars; URLs verified; confirm Step 08 domains untouched.

---

# Step 08 — Remaining Frontend Integration

### Objective

Connect reels, about, services, journal, site chrome (if desired), and contact form to the API. Replace dummy usage only after each slice works. Update reel player to YouTube embeds.

### Repository Preconditions

- Step 07 portfolio integration working.
- Step 05 contact API + Step 06 media contract available.

### Scope

**Permitted**

- API hooks/loads for: `Reels`, `ReelPlayerModal` (iframe embed), `About`, `Services`, `Journal`, `JournalArticle`, `Contact` submit, and optionally `Navbar`/`Footer`/`Contact` sidebar via `/api/site/` and `/api/home/` if not done.
- Replace `setTimeout` fake submit with `POST /api/contact/`; map field errors; keep success receipt UI.
- Loading/error/empty states consistent with Step 07 patterns.
- After verification, stop importing obsolete mock constants from pages (mock files may remain temporarily for reference but should not be required at runtime). Prefer deleting unused mock exports only when no imports remain — if uncertain, leave files but unused.
- Update TS types for reels (`youtubeVideoId` / `embedUrl` instead of `videoSrc`).

**Forbidden**

- Visual redesign, new pages, auth UI, payments.
- Deployment (Step 10).
- Broad refactors unrelated to data loading.

### Detailed Implementation Tasks

1. Reels: fetch `/api/reels/`; category filter preserved; modal uses YouTube iframe with `title`, `allow`, `allowFullScreen`, nocookie embed URL from API; keyboard nav preserved.
2. Journal: list + detail; 404 state for unknown slug preserved.
3. About/Services: single payload fetch each.
4. Contact: async submit; disable button while pending; show server errors.
5. Site social links: switch to `/api/site/` when ready so Admin can update footers without redeploy.
6. Run lint/build; fix type errors from reel field changes.

### Files and Directories Affected

- `frontend/src/pages/{Reels,About,Services,Journal,JournalArticle,Contact,Home}.tsx` as needed
- `frontend/src/components/reels/ReelPlayerModal.tsx` (video → iframe)
- `frontend/src/components/{Navbar,Footer}.tsx` if site API used
- `frontend/src/data/*` — stop runtime use; optional cleanup
- API client expansions

### Expected Deliverables

- Full site content from API in local dual-server setup
- Contact persists to Postgres

### Design and Compatibility Requirements

- Preserve approved cinematic UI.
- Reel modal should still feel like the cinema modal (dark backdrop, captions) — only the media engine changes to YouTube.

### Explicitly Out of Scope

- EC2, Render, production hardening pass (Step 09/10), new features.

### Dependencies and Prerequisites

- Steps 04–07.
- Real or placeholder YouTube IDs in DB.

### Acceptance Criteria

- [x] All primary routes load API data without console errors.
- [x] Contact creates Admin-visible inquiry.
- [x] Journal detail + prev/next still sensible (prev/next may be client-side on fetched list or omitted if list order matches API `sort_order` — preserve UX).
- [x] `npm run build` passes.
- [x] Mocks no longer required for runtime.

### Local Verification

Run backend + frontend; manually walk:

- `/`, `/work`, `/work/drone`, `/reels` (play embed), `/about`, `/services`, `/journal`, `/journal/<slug>`, `/contact` (submit real POST)
- Mobile nav + forms
- Browser Network + console clean of CORS/mixin errors

### Regression Checks

- Portfolio filters/lightbox from Step 07 still pass.
- 404 page still works.

### Completion Report

Confirm each page’s data source; note any remaining hardcoded copy; confirm no deployment work done.

---

# Step 09 — Integration QA, Security, and Reliability

### Objective

End-to-end QA of frontend/backend, permissions, error handling, security settings review, accessibility smoke fixes for integration regressions, and reliability polish before deployment.

### Repository Preconditions

- Steps 01–08 functionally complete locally.

### Scope

**Permitted**

- Fix bugs found in integration (CORS, error states, edge-case empty lists, unpublished leakage, contact validation mismatches).
- Add/adjust tests for critical regressions discovered.
- Verify `DEBUG`/security-related settings documentation for production (without necessarily deploying).
- Accessibility fixes for issues introduced by loading/error UI (focus, aria-live on contact success already exists — preserve).
- Confirm Vercel build from `frontend/` directory.
- Performance sanity: no accidental huge payloads (journal list without full bodies).

**Forbidden**

- New features, redesigns, EC2 provisioning (Step 10).
- Disabling security to “make it work.”
- Committing secrets.

### Detailed Implementation Tasks

1. Checklist test matrix:

   - Published vs unpublished content
   - Invalid contact payloads
   - API 404s → UI empty/error
   - Reel embed with invalid ID cannot be created in Admin
   - Admin requires login
   - Public cannot access `/admin/` without credentials
   - Frontend build on clean install

2. Run backend tests + frontend build + lint.
3. Manual responsive pass on key pages.
4. Produce a short QA notes section in the completion report (not a new markdown file unless fixing README).

### Files and Directories Affected

- Only files required to fix defects found
- Possibly README troubleshooting notes

### Expected Deliverables

- Green local verification suite
- Known issues list (if any) with severity

### Design and Compatibility Requirements

- No intentional visual redesign; bugfix only.

### Explicitly Out of Scope

- Live AWS deployment, domain purchase, Render signup.

### Dependencies and Prerequisites

- Steps 01–08.

### Acceptance Criteria

- [ ] All automated tests pass.
- [ ] `frontend` production build succeeds.
- [ ] Dual-server smoke path passes.
- [ ] Security checklist documented (SECRET_KEY not in repo, DEBUG strategy, CORS origins, throttle on contact).

### Local Verification

```bash
cd backend && python manage.py test
cd frontend && npm run lint && npm run build && npm run preview
# plus manual dual-server QA
```

### Regression Checks

- Full route walk once more.
- Contact throttle does not break normal single submit.

### Completion Report

QA matrix results; bugs fixed; residual risks; confirm Step 10 not executed.

---

# Step 10 — AWS EC2 Deployment and Production Readiness

### Objective

When the user explicitly requests this step, deploy the Django backend to AWS EC2 for a temporary learning environment (~30–40 days), configure Nginx + Gunicorn + PostgreSQL + HTTPS, wire Vercel `VITE_API_BASE_URL` to the public API, and document Render migration without AWS-specific app coupling.

### Repository Preconditions

- Steps 01–09 complete and locally verified.
- User provides: EC2 access, domain/DNS (or accepts IP+HTTPS limitation), secrets, Vercel env access.

### Scope

**Permitted**

- Production settings module or env-based production configuration.
- `gunicorn` service (systemd), Nginx reverse proxy, Certbot HTTPS (if domain available).
- Postgres on-box **or** user-chosen managed Postgres — document costs; do not mandate paid RDS.
- `collectstatic`, migrations, superuser creation on server.
- Firewall/security group guidance (22/80/443 only as appropriate).
- Backup/restore scripts or documented `pg_dump` / `pg_restore` procedures.
- Smoke tests against public `/api/health/` and one content endpoint.
- Vercel env: set `VITE_API_BASE_URL` to production API (user may need to paste in dashboard).
- Render migration appendix: same Dockerless app, env vars, managed Postgres, update CORS + Vercel API URL, restore dump.

**Forbidden**

- Rewriting frontend design.
- Implementing new product features.
- Hardcoding EC2 public DNS into source.
- Using S3/CloudFront/AWS SES as mandatory components.
- Force-pushing or destructive Git operations.

### Detailed Implementation Tasks

1. Confirm instance OS (Ubuntu), Python version, Postgres install, non-root deploy user.
2. Clone repo; create venv; install requirements; configure `/etc/environment` or systemd `EnvironmentFile` from `.env` (never commit).
3. Migrate + seed or restore data; collectstatic; Gunicorn socket/service.
4. Nginx site config → proxy to Gunicorn; serve static admin assets.
5. TLS via Certbot when DNS ready; otherwise document HTTP-only limitation (not preferred).
6. Set `DEBUG=False`, strong `SECRET_KEY`, tight `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` including Vercel URL, `CSRF_TRUSTED_ORIGINS`.
7. Basic log locations (`journalctl`, Nginx access/error).
8. Backup cron example for `pg_dump`.
9. Update Vercel env + redeploy frontend.
10. Write Render migration notes in root `README.md` (differences table).

### Files and Directories Affected

- `backend/config/settings*.py` production hardening
- Optional `deploy/nginx.conf` example, `deploy/gunicorn.service` example (keep generic)
- Root `README.md` deployment section
- No AWS Console automation required (manual steps OK for learning)

### Expected Deliverables

- Public API reachable over HTTPS (or documented blocker)
- Vercel frontend talking to production API
- Backup + Render migration instructions

### Design and Compatibility Requirements

- Frontend remains on Vercel; backend portable.
- Media remains external URLs (instance disk not content store).

### Explicitly Out of Scope

- Multi-AZ HA, Kubernetes, Terraform (unless user later asks), email provider setup, paid AWS services forced without disclosure.

### Dependencies and Prerequisites

- User AWS account + SSH.
- Domain optional but recommended for HTTPS.
- Vercel project Root Directory already `frontend` (from Step 01 manual action).

### Acceptance Criteria

- [ ] `GET https://<api-host>/api/health/` 200
- [ ] `GET /api/portfolio/` 200 from browser origin on Vercel (CORS OK)
- [ ] Admin accessible over HTTPS
- [ ] Contact POST works from production site
- [ ] Backup command documented and tested once
- [ ] Render migration section present

### Local Verification

Not sufficient alone — perform production smoke tests. Also re-verify local still works.

### Regression Checks

- Production frontend routes still render.
- No mixed-content HTTP API calls from HTTPS Vercel site.

### Completion Report

Include hosts, what was deployed, costs/free-tier notes, manual DNS/Vercel actions, backup verification, Render migration summary, confirmation that no extra features were added.

---

## Cross-Cutting Testing Commands (Reference)

**Frontend**

```bash
cd frontend
npm run lint
npm run build
npm run dev
npm run preview
```

**Backend**

```bash
cd backend
python manage.py check
python manage.py test
python manage.py migrate
python manage.py runserver
```

Do not add Jest/Cypress/Playwright unless a Step 09 bug truly requires it; prefer Django tests + manual browser QA.

---

## Completion Report Template (Required After Every Step)

Antigravity must end each executed step with:

```markdown
## Completion Report — Step NN

- **Step completed:** NN — <title>
- **Files created / changed / moved / removed:** …
- **Features implemented:** …
- **Commands executed:** …
- **Tests executed and results:** …
- **Local URLs verified:** … (or “not performed” with reason)
- **Known limitations / blocked checks:** …
- **Manual actions required from user:** …
- **Confirmation:** No future step was implemented.
```

A step is not complete merely because code was written — verification is mandatory.

---

## Assumptions Log

| ID | Assumption | Basis |
|----|------------|--------|
| AS-1 | npm remains the package manager | `package-lock.json` present |
| AS-2 | Vite `dist/` output directory | default `vite.config.ts` has no custom `build.outDir` |
| AS-3 | Portfolio items are single-media records | `PortfolioItem` interface + lightbox |
| AS-4 | Reels will migrate from HTML5 MP4 to YouTube | brief requirement + current MDN MP4 discrepancy |
| AS-5 | Email notifications out of v1 | brief default + no existing mail code |
| AS-6 | Django Admin is the CMS | brief + no existing admin UI |
| AS-7 | Vercel Root Directory must be updated manually after move | agent has no dashboard access |
| AS-8 | Unsplash URLs in seed are temporary placeholders | current mock data; not permanent DAM |

---

## Discrepancies vs Project Brief

| Brief expectation | Actual repo finding | Plan response |
|-------------------|---------------------|---------------|
| YouTube reels already conceptualized in UI | HTML5 `<video>` + MP4 demos | Step 06 backend + Step 08 iframe player |
| Cloudinary in use | Not configured; Unsplash URLs | URL fields + optional public_id; Admin paste |
| `frontend/` / `backend/` structure | Flat frontend at repo root | Step 01 restructure |
| Backend exists | No backend | Steps 02–06 create it |
| Env examples exist | None | Step 02 / 07 add `.env.example` |
| Multi-image projects | Single `src` per item | No gallery child model |
| Generic `/api/projects/` | Frontend uses portfolio items + disciplines | Use `/api/portfolio/` + `/api/disciplines/` |
| Root `execution.md` plan | Obsolete frontend-only plan (gitignored) | Superseded by `execution/execution.md` |

---

*End of plan. Implement only when the user says: `Execute Step NN`.*
