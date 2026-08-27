# IPPS Setu — living spec

Government ↔ Startup innovation procurement platform (Phase 1). React 19 + Vite frontend
(ported JSX pages preserved as-is), FastAPI/Mongo backend untouched from the template.
**All app data is MOCKED** in `frontend/src/data/mockData.js` and served through
`frontend/src/services/api.js` (promise-based, simulated latency). No backend persistence.

## Theme
Light **Navy + White + Teal** palette. `frontend/src/index.css` keeps the original
palette variables, then a "LIGHT THEME" override block at the end of the file
redefines the semantic tokens (white cards, mint `--bg-primary`, navy text) and
restyles surfaces/badges. The sidebar stays deep navy and re-scopes `--text-*`
inside `.app-sidebar` so inline styles remain legible. Status colours: green =
success/open, amber = attention/deadline, purple = pilot/category, red = rejected.

## Routing (frontend/src/App.tsx — BrowserRouter lives in main.tsx)
- `/` LandingPage, `/login` LoginPage (role picker)
- Government (`GovernmentLayout`): `/gov/dashboard`, `/gov/challenges`,
  `/gov/challenges/create`, `/gov/challenges/:id`, `/gov/challenges/:id/edit`,
  `/gov/evaluation`; every other sidebar path renders `ComingSoon`.
- Startup (`StartupLayout`): `/startup/dashboard`, `/startup/marketplace`,
  `/startup/marketplace/:id`, `/startup/marketplace/:id/apply`,
  `/startup/applications`; other sidebar paths render `ComingSoon`.
- Unknown URLs redirect to `/`.

## Auth
`AppContext.login(role, email, password)` accepts any credentials and loads
`mockUsers[role]`. Login page role choice decides the destination:
government → `/gov/dashboard`, startup → `/startup/dashboard`. No route guards
(deep links work directly). Logout clears local storage and returns to `/`.

## Key startup flow
Marketplace (filters: search/sector/status) → Challenge detail (tabs: overview,
requirements, eligibility, AI match) → Submit Proposal (3-step form: solution,
pilot plan, team+consent) → proposal stored in `AppContext.proposals` (session
memory) → My Applications shows it with a 5-stage progress timeline.

## Seed facts
- Challenges: CH-2024-001…006 (statuses Evaluation, Pilot, Published, Published, Draft, Procurement)
- "My" startup on the startup portal = ST-003 NovaTech Solutions; it has APP-2024-002 (Evaluation)
- New proposals get ids like `APP-2024-004` and status `Submitted`
