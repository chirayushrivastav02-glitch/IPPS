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

## Expert Network (startup portal)
Connects startups on an active application/pilot with fictional domain experts.
- Data: `frontend/src/data/expertMentors.js` (10 profiles, EXP-001…010) — every
  profile is labelled **"Demo Expert"** in the UI.
- Matching: `frontend/src/lib/expertMatching.js` (`rankExpertsForChallenge`,
  `applyExpertFilters`) scores each expert against the selected challenge
  (direct challenge fit, sector depth, expertise keyword hits, rural/last-mile
  signal) and produces the "Recommended because…" explanation.
- Service: `expertsAPI` in `services/api.js` (getAll / getById / getRecommended /
  requestMentorship / updateMentorship / saveOutcome) — mock bodies, real-API-ready shapes.
- Pages: `/startup/experts` (context selector + Recommended / All Experts / My
  Mentorships tabs; filters = search, industry, expertise, challenge sector, min
  match score) and `/startup/experts/:id` (expertise, sectors, experience,
  recommended projects). Sidebar entry "Expert Network"; "Find Experts" shortcut
  on each application card deep-links with `?challenge=CH-…`.
- Mentorship flow (session state in `AppContext.mentorships`): Requested →
  Scheduled → Completed → Mentorship Outcomes (Key Advice, Recommended Actions,
  Expected Impact, Next Steps). No messaging/video/external integrations.

## Interaction & polish layer
Appended at the end of `frontend/src/index.css` ("INTERACTION POLISH + TIMELINE
ALIGNMENT"): 200–300ms hover lifts on `.card/.kpi-card/.challenge-card`, buttons,
sidebar items and tags (with `prefers-reduced-motion` opt-out), overflow guards,
branding subtitle sizing so "Innovation Procurement Platform" never crops, and a
grid-based `.timeline-track / .timeline-node` timeline (dots share one centre
line, connectors drawn as node ::before/::after at the dot centre, labels centred
under each dot). Stage icons: Submitted=FileText, Screening=SearchCheck,
Evaluation=ClipboardList, Shortlisted=Star, Pilot=Rocket; mentorship stages use
Send / CalendarCheck / CheckCircle2. The old `.process-timeline` classes are
unused but left in place.

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
