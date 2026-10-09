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
├── backend/              # Django + Django REST Framework API (Steps 02–06)
│   └── .gitkeep          # Scaffold placeholder
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

## Backend (Coming in Step 02+)

The Django backend API and PostgreSQL database are introduced starting in Step 02 under the `backend/` directory.

---

## Deployment Note (Vercel)

For existing or new Vercel deployments of the frontend:
1. Open your project settings on the **Vercel Dashboard**.
2. Under **General > Root Directory**, click **Edit** and set it to:
   ```
   frontend
   ```
3. Save settings. Vercel will automatically detect the Vite preset and run `npm run build` from `frontend/`.
