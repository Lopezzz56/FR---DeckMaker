# FocusRealm Presentation Studio

A production-ready, AI-powered executive presentation generator for FocusRealm's **Mise Hotel** service execution platform.

## Key Features

1. **Strict 8-Slide Executive Architecture** (following `Presentation.md`):
   - **Section 1: FocusRealm Introduction (Slides 1–4)**:
     - Slide 1: *Introduction to FocusRealm* (Core value proposition, leadership team with genuine portraits of Sehej Sharma, Ali Electricwala, Aditya Mishra, and advisory credentials).
     - Slide 2: *Six Industry Challenges* (Supervisor Bottleneck, Ghost SOP, Invisible Performance Gap, Attrition Bleed, Star Rating Ceiling, Audit Ambush).
     - Slide 3: *How Mise Works* (SOPs &rarr; Timed Tasks &rarr; Staff Mobile App &rarr; Tamper-Proof Evidence, featuring genuine product screenshots).
     - Slide 4: *Value and Outcomes* (Six outcomes measured against the property's own baseline, not abstract industry averages).
   - **Section 2: Personalized Hospitality Presentation (Slides 5–8)**:
     - Slide 5: *Understanding Your Business* (Researched portfolio, property assets, business model, and operational footprint).
     - Slide 6: *Our Understanding of the Opportunity* (Operational challenges with clear `[VERIFIED FACT]` and `[OPERATIONAL HYPOTHESIS]` badges with source URLs).
     - Slide 7: *How FocusRealm Fits Your Business* (Tailored execution layer, owner reporting evidence, and operator-led design).
     - Slide 8: *Next Steps* (Practical, low-risk 1-property, 1-shift pilot roadmap).

2. **Research & Ground Truth Engine**:
   - Web scraping and domain research engine prioritizing official property portals and press.
   - Separate tagging for verified factual statements vs reasonable operational hypotheses.
   - Source citations and links stored for every claim.

3. **Brand Detection & Manual Override**:
   - Extracts primary and accent brand colors from target property websites.
   - Interactive Color Picker and Curated Luxury Palettes (Sapphire & Amber, Heritage Forest & Champagne, Mahogany & Sand, Palace Gold).
   - Dynamically updates personalized slides without compromising FocusRealm's visual identity.

4. **Slide Editing & Regeneration**:
   - In-line editing of headlines, subtext, cards, badges, and footer notes.
   - Single-slide AI regeneration controls with prompt presets.

5. **Multi-Format Export & History**:
   - **PPTX Export**: Produces 16:9 widescreen, fully editable PowerPoint decks via PptxGenJS with styled shapes, typography, and embedded genuine screenshots.
   - **Print / PDF**: High-resolution print-ready output.
   - **Presentation Mode**: Distraction-free full-screen slideshow with keyboard navigation.
   - **History Store**: Persistent presentation management across client accounts.

## Running Locally

### Prerequisites
- Node.js v18+ (tested on v24)
- npm

### Quick Start
To start both backend and frontend concurrently:
```bash
npm run dev
```

Or start them individually:
```bash
# Start backend (Port 3001)
npm run server

# Start frontend (Port 5173)
npm run client
```

Open `http://localhost:5173` in your browser.
