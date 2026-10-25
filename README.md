# FocusRealm Deck Maker

An intelligent, layout-driven presentation platform built for **FocusRealm** to power executive outreach, partnership campaigns, and personalized enterprise sales decks for the **Mise Hotel** service execution platform.

---

## What Deck Maker Does

FocusRealm Deck Maker automates the creation of high-impact, tailor-made hospitality sales presentations in seconds:

- **Automated Client Dossiers & Ground Truth**: Researches target hotel groups, luxury chains, boutique properties, or independent resorts using official sources and press releases.
- **Adaptive 12-Slide Executive Narrative**:
  - **Part 1 (The Platform)**: Platform philosophy, genuine leadership & advisory rosters, real product interfaces (Attendant Mobile & Supervisor Dashboards), and proven floor workflows.
  - **Part 2 (Tailored Fit)**: Adapts specifically to whether the prospect is a multi-property chain, luxury resort, or boutique portfolio, proposing clear execution fits and low-risk pilot proposals.
- **Canonical Presentation Engine**: A single source of truth (1920 × 1080 canvas) that renders pixel-for-pixel identically across the interactive web studio, full-screen presenter mode, PDF downloads, and PowerPoint (PPTX) exports.
- **Brand Palette Intelligence**: Automatically discovers brand colors from client websites and adapts slide accents while preserving FocusRealm's luxury editorial design language.
- **Export Anywhere**: Download high-resolution print-ready PDFs or fully editable native 16:9 widescreen PowerPoint (`.pptx`) decks.

---

## Quick Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- `npm`

### 1. Installation
Clone the repository and install all dependencies:
```bash
npm install
npm --prefix client install
npm --prefix server install
```

### 2. Start the Development Server
Run both client and server concurrently:
```bash
npm run dev
```

- **Web Studio (Frontend)**: `http://localhost:5175` (or `5173`)
- **Backend API**: `http://localhost:3001`

---

## Production Build & Deployment

### Build Locally
To test the production bundles:
```bash
# Build frontend
npm run build

# Build backend
npm --prefix server run build
```

### Deploy to Vercel
The frontend is pre-configured for instant deployment on [Vercel](https://vercel.com):
1. Push this repository to GitHub or GitLab.
2. Import the project into Vercel.
3. Vercel automatically detects `vercel.json` and builds the client into `client/dist`.

---

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas API, jsPDF
- **Backend**: Node.js, Express, TypeScript, PptxGenJS, Puppeteer Core
- **Design System**: FocusRealm Editorial Luxury Design System with 1920×1080 Canonical Geometry
