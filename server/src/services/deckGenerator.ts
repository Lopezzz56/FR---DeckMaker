import { CompanyDossier, PresentationDeck, SlideData, BrandPalette } from '../types/presentation.js';
import { toCanonicalSlide, validateCanonicalSlide } from './canonicalAdapter.js';

// Classic Executive Navy / Blue Palette
export const FOCUSREALM_CLASSIC_PALETTE: BrandPalette = {
  primary: '#1e40af',    // Blue-800
  secondary: '#0f172a',  // Slate-900
  accent: '#2563eb',     // Blue-600
  background: '#f8fafc', // Slate-50
  surface: '#ffffff',    // White
  text: '#0f172a',       // Slate-900
  textMuted: '#64748b',  // Slate-500
  border: '#e2e8f0'      // Slate-200
};

// Authentic Live Mise Brand Palette (from https://fr2-b6s.pages.dev/)
export const MISE_BRAND_PALETTE: BrandPalette = {
  primary: '#102f35',    // Deep Forest Green
  secondary: '#173d45',  // Forest Teal
  accent: '#3db89e',     // Vibrant Mint / Teal
  background: '#f5f2e9', // Warm Parchment
  surface: '#ffffff',    // Clean Surface
  text: '#102f35',       // Deep Forest Ink
  textMuted: '#577176',  // Forest Slate
  border: '#d8d2c4'      // Warm border
};

// Backwards-compatible alias
export const FOCUSREALM_PALETTE = MISE_BRAND_PALETTE;

/**
 * Generate the comprehensive 12-slide executive presentation
 * Following the Mathur Hospitality reference storytelling and Presentation.md
 */
export function generate8SlideDeck(dossier: CompanyDossier, preferredTheme: 'mise' | 'classic' = 'mise'): PresentationDeck {
  const companyName = dossier.name;
  const targetPalette = dossier.brandPalette;
  const corePalette = preferredTheme === 'classic' ? FOCUSREALM_CLASSIC_PALETTE : MISE_BRAND_PALETTE;

  // Slide 1: Executive Cover / Platform Overview
  const slide1: SlideData = {
    id: 'slide-1',
    slideNumber: 1,
    section: 'focusrealm_core',
    headerTag: '01 / 12',
    eyebrow: 'HOTEL SERVICE EXECUTION PLATFORM',
    title: 'Ownership you can see. Accountability you can prove.',
    subtitle: `An executive conversation on service execution, prepared for ${companyName}.`,
    footerNote: 'Mise is care.',
    layoutType: 'intro_title',
    cards: [
      {
        id: 's1-c1',
        title: 'Execution on the Floor',
        description: 'Carrying proven SOPs into live shifts with room-by-room dispatch and timed windows.',
        badge: 'Core Platform'
      },
      {
        id: 's1-c2',
        title: 'Proof for Leadership',
        description: 'Tamper-proof photo evidence and instant exception alerts for lean supervisory teams.',
        badge: 'Accountability'
      },
      {
        id: 's1-c3',
        title: 'Audit & Owner Records',
        description: 'Immutable records for brand audits, owner reviews, and consistent 5-star delivery.',
        badge: 'Assurance'
      }
    ]
  };

  // Slide 2: People Leading FocusRealm (Founders / Leadership - Circular Portraits)
  const slide2: SlideData = {
    id: 'slide-2',
    slideNumber: 2,
    section: 'focusrealm_core',
    headerTag: '02 / 12',
    eyebrow: 'OUR TEAM',
    title: 'The people building Mise.',
    subtitle: 'Built by hospitality operators and engineers with direct floor experience.',
    footerNote: 'FocusRealm Executive Team',
    layoutType: 'team_portraits',
    cards: [
      {
        id: 's2-c1',
        title: 'Sehej Sharma',
        description: 'Chief Executive Officer. Driving platform strategy, luxury hospitality partnerships, and enterprise vision.',
        imageUrl: '/assets/p2_img1.png',
        badge: 'Chief Executive Officer'
      },
      {
        id: 's2-c2',
        title: 'Ali Electricwala',
        description: 'Chief Operating Officer. Leading floor operations, property onboarding, and staff adoption.',
        imageUrl: '/assets/p2_img2.png',
        badge: 'Chief Operating Officer'
      },
      {
        id: 's2-c3',
        title: 'Aditya Mishra',
        description: 'Chief Technology Officer. Architecting real-time shift systems, audit trails, and offline resilience.',
        imageUrl: '/assets/p2_img3.png',
        badge: 'Chief Technology Officer'
      }
    ]
  };

  // Slide 3: Mentors & Industry Advisors (Circular Portraits)
  const slide3: SlideData = {
    id: 'slide-3',
    slideNumber: 3,
    section: 'focusrealm_core',
    headerTag: '03 / 12',
    eyebrow: 'ADVISORY BOARD',
    title: 'The people guiding us.',
    subtitle: 'Decades of luxury training, standards development, and operational excellence.',
    footerNote: 'FocusRealm Service Execution Platform',
    layoutType: 'advisors_list',
    cards: [
      {
        id: 's3-c1',
        title: 'Renu Mehra',
        description: 'Luxury & Celebrity Image Consultant & Corporate Trainer. Specializes in luxury etiquette, grooming, and 5-star brand identity.',
        imageUrl: '/assets/p3_img1.png',
        badge: 'Industry Advisor'
      },
      {
        id: 's3-c2',
        title: 'Parul Sharma',
        description: 'Master Hospitality Trainer & Quality Auditor. Trained hotel staff for over 20 years in floor SOP discipline across premier chains.',
        imageUrl: '/assets/p3_img2.png',
        badge: 'Industry Advisor'
      }
    ]
  };

  // Slide 4: The problem and industry context (6 Challenges)
  const slide4: SlideData = {
    id: 'slide-4',
    slideNumber: 4,
    section: 'focusrealm_core',
    headerTag: '04 / 12',
    eyebrow: 'INDUSTRY CONTEXT',
    title: 'Six challenges we hear across the industry.',
    subtitle: 'Why standard operating procedures fail between the binder and the daily shift.',
    footerNote: 'FocusRealm Service Execution Platform',
    layoutType: 'grid_six',
    cards: [
      {
        id: 's4-c1',
        number: '01',
        title: 'Supervisor Bottleneck',
        description: 'Supervision happens in person. However capable a manager is, nobody can be on every floor or inspect every room at once.'
      },
      {
        id: 's4-c2',
        number: '02',
        title: 'Ghost SOP',
        description: 'A carefully written procedure sits in a folder or binder, while daily practice gradually and silently moves away from it.'
      },
      {
        id: 's4-c3',
        number: '03',
        title: 'Invisible Performance Gap',
        description: 'From head office, a strong shift and a difficult one look alike. Good work goes unrecognised, and small slips surface late.'
      },
      {
        id: 's4-c4',
        number: '04',
        title: 'Attrition Bleed',
        description: 'When staff are not set up to succeed with clear expectations, they move on. Hard-won experience leaves with them, and recruitment restarts.'
      },
      {
        id: 's4-c5',
        number: '05',
        title: 'Star Rating Ceiling',
        description: 'Consistency is what lifts ratings and reviews. Without it, a property can plateau despite the individual effort of its teams.'
      },
      {
        id: 's4-c6',
        number: '06',
        title: 'Audit Ambush',
        description: 'Owners and brand reviews ask for evidence. Without a record kept as the work happens, it has to be painfully assembled afterwards.'
      }
    ]
  };

  // Slide 5: How Mise Works (4-Step Progression Architecture Overview)
  const slide5: SlideData = {
    id: 'slide-5',
    slideNumber: 5,
    section: 'focusrealm_core',
    headerTag: '05 / 12',
    eyebrow: 'HOW MISE WORKS',
    title: 'Your standards, implemented. Executed on every floor.',
    subtitle: 'Mise does not rewrite your standards. It implements the standards your team has already proven.',
    footerNote: 'Mise Architecture Overview',
    layoutType: 'workflow_overview',
    cards: [
      {
        id: 's5-step1',
        number: '1',
        title: 'Your standard',
        description: 'The proven procedures your team already trusts, carried directly into Mise without alteration.',
        badge: 'Step 1'
      },
      {
        id: 's5-step2',
        number: '2',
        title: 'Implemented as timed tasks',
        description: 'Each standard becomes a task for the right role, in the right room, with a defined execution window.',
        badge: 'Step 2'
      },
      {
        id: 's5-step3',
        number: '3',
        title: 'Executed on staff phone',
        description: 'Staff complete each step on their phone, with photo evidence where your standard requires it.',
        badge: 'Step 3'
      },
      {
        id: 's5-step4',
        number: '4',
        title: 'Evidence on record',
        description: 'A tamper-proof service record that supports manager review, owner reporting and audit.',
        badge: 'Step 4'
      }
    ]
  };

  // Slide 6: On the floor (Staff Mobile Experience - Hero Mobile Visual)
  const slide6: SlideData = {
    id: 'slide-6',
    slideNumber: 6,
    section: 'focusrealm_core',
    headerTag: '06 / 12',
    eyebrow: 'ON THE FLOOR',
    title: 'What the staff member sees: her rooms, her shift, one screen.',
    subtitle: 'Clear room assignment, sequential timed windows, and instant SOP checklists on staff phones.',
    footerNote: 'Mise Mobile Floor Application',
    layoutType: 'staff_experience',
    cards: [
      {
        id: 's6-screen',
        title: 'Staff Mobile Screen',
        description: 'Mobile shift execution interface showing room assignments and timed execution windows.',
        imageUrl: '/assets/p7_img1.png',
        imageCaption: 'Live shift view for room attendants'
      },
      {
        id: 's6-f1',
        number: '01',
        title: 'Shift at a glance',
        description: 'Scheduled hours, check-in status and unassigned time for the shift are shown together.'
      },
      {
        id: 's6-f2',
        number: '02',
        title: 'Rooms in sequence',
        description: 'Each assigned room is listed with its time window. One outside the shift is flagged and kept separate from hours.'
      },
      {
        id: 's6-f3',
        number: '03',
        title: 'Time stated plainly',
        description: 'Unassigned time is shown separately from break time, so the schedule is never misread.'
      },
      {
        id: 's6-f4',
        number: '04',
        title: 'Four places, nothing more',
        description: 'Today, My shift, My log and Guides: the only screens a staff member needs during a shift.'
      }
    ]
  };

  // Slide 7: Supervision (Manager Dashboard - Hero Desktop Visual)
  const slide7: SlideData = {
    id: 'slide-7',
    slideNumber: 7,
    section: 'focusrealm_core',
    headerTag: '07 / 12',
    eyebrow: 'SUPERVISION',
    title: 'The manager’s view: assignments, exceptions and evidence.',
    subtitle: 'Room assignments and blocked work resolved in seconds from one intuitive desktop dashboard.',
    footerNote: 'Mise Manager Control Center',
    layoutType: 'manager_experience',
    cards: [
      {
        id: 's7-dashboard',
        title: 'Manager Supervision Dashboard',
        description: 'Shift management control center with real-time room dispatch and attendance verification.',
        imageUrl: '/assets/p8_img1.png',
        imageCaption: 'Real-time floor supervision dashboard'
      },
      {
        id: 's7-p1',
        title: 'Choose the shift',
        description: 'Morning, afternoon and night shifts, each with its staff target and room count.'
      },
      {
        id: 's7-p2',
        title: 'Assign and clear',
        description: 'Room assignments and blocked work are resolved from one unified control screen.'
      },
      {
        id: 's7-p3',
        title: 'Unknown is not absent',
        description: 'Attendance not yet confirmed is shown as unknown, never prematurely marked as absent or late.'
      }
    ]
  };

  // Slide 8: Author Portal (Standards & SOP Creation)
  const slide8: SlideData = {
    id: 'slide-8',
    slideNumber: 8,
    section: 'focusrealm_core',
    headerTag: '08 / 12',
    eyebrow: 'AUTHOR PORTAL',
    title: 'Authored once by your team. Published to the properties you choose.',
    subtitle: 'Turn static PDF checklists into interactive, time-bound floor workflows across your portfolio.',
    footerNote: 'Mise Standards Authoring Engine',
    layoutType: 'author_experience',
    cards: [
      {
        id: 's8-screen',
        title: 'SOP Authoring Studio',
        description: 'Clean standards authoring interface with real-time field validation.',
        imageUrl: '/assets/p9_img1.jpeg',
        imageCaption: 'Standards authoring and workflow editor'
      },
      {
        id: 's8-p1',
        number: '1',
        title: 'Enter your standard',
        description: 'Title, code, role, target time and search tags, as your team already defines them. Drafts remain in the editor until published.'
      },
      {
        id: 's8-p2',
        number: '2',
        title: 'Publish and track',
        description: 'Each published version links to active tasks. Historical records stay immutable with full author visibility.'
      }
    ]
  };

  // Slide 9: What changes (6 Measured Outcomes)
  const slide9: SlideData = {
    id: 'slide-9',
    slideNumber: 9,
    section: 'focusrealm_core',
    headerTag: '09 / 12',
    eyebrow: 'WHAT CHANGES',
    title: 'Six outcomes, measured against your own baseline.',
    subtitle: 'Measured against your own operational baseline, not an abstract industry average.',
    footerNote: 'Demonstrated operational improvements in live shifts',
    layoutType: 'grid_six',
    cards: [
      {
        id: 's9-c1',
        number: '01',
        title: 'Your standard runs after you leave',
        description: 'The routine your leadership team sets at a property carries on in the same form once they move to the next property.'
      },
      {
        id: 's9-c2',
        number: '02',
        title: 'Evidence you can show an owner',
        description: 'An incontrovertible record of what was completed on the floor, ready whenever you report on property performance.'
      },
      {
        id: 's9-c3',
        number: '03',
        title: 'One standard, many property types',
        description: 'Resorts, villas, and destination spas each run their own adapted version of a core standard written once by your team.'
      },
      {
        id: 's9-c4',
        number: '04',
        title: 'A new mandate starts on your standard',
        description: 'When taking on a new management mandate, your standard is live on the floor from the very first shift.'
      },
      {
        id: 's9-c5',
        number: '05',
        title: 'Supervision without more supervisors',
        description: 'Completion is verified from a screen rather than solely on foot, supporting the lean management teams you plan for.'
      },
      {
        id: 's9-c6',
        number: '06',
        title: 'Earlier correction, fewer recoveries',
        description: 'Missed steps surface in real time during the shift while they can still be resolved, rather than later in an unhappy guest review.'
      }
    ]
  };

  // SECTION 2: PERSONALIZED COMPANY PRESENTATION (Slides 10–12)

  // Slide 10: Understanding your business (Personalized Portfolio & Scale)
  const isChain = dossier.properties && dossier.properties.length > 3;
  const isBoutique = dossier.properties && dossier.properties.length <= 2;
  const propertyTypes = Array.from(new Set(
    (dossier.properties || []).map(p => typeof p === 'string' ? 'Property' : (p.type || 'Property'))
  )).join(', ');

  let portfolioContext = 'Tailored luxury hotel operations with high standards of operational discipline.';
  if (isChain) {
    portfolioContext = `Multi-property consistency across diverse destinations, maintaining uniform brand standards at scale.`;
  } else if (isBoutique) {
    portfolioContext = `Independent boutique hospitality where personalized guest touchpoints and room presentation define your brand.`;
  } else if (propertyTypes) {
    portfolioContext = `Distinctive portfolio balancing property character with rigorous operational accountability.`;
  }

  let propListText = (dossier.properties && dossier.properties.length > 0)
    ? (dossier.properties as any[]).map(p => typeof p === 'string' ? p : `${p.name}${p.location ? ` (${p.location})` : ''}`).join(' • ')
    : 'Boutique and luxury hospitality portfolio across key regional markets';
  if (propListText.length > 140) {
    propListText = propListText.slice(0, 137) + '...';
  }

  const slide10: SlideData = {
    id: 'slide-10',
    slideNumber: 10,
    section: 'personalized',
    headerTag: '10 / 12',
    eyebrow: 'UNDERSTANDING YOUR BUSINESS',
    title: `A portfolio you run, property by property.`,
    subtitle: `Operational footprint, property assets, and service philosophy of ${companyName}.`,
    footerNote: `Researched from official property sources and verified operational records`,
    layoutType: 'company_overview',
    customBrandTheme: targetPalette,
    cards: [
      {
        id: 's10-c1',
        number: '01',
        title: 'Portfolio Scale & Operating Model',
        description: portfolioContext
      },
      {
        id: 's10-c2',
        number: '02',
        title: isChain ? 'Flagship Properties & Footprint' : 'Properties & Locations',
        description: propListText,
        sourceUrl: dossier.sources?.[0]?.url
      },
      {
        id: 's10-c3',
        number: '03',
        title: 'Your Proven Standards',
        description: 'Procedures refined over years for your guest profile, preserved intact rather than replaced with generic checklists.'
      },
      {
        id: 's10-c4',
        number: '04',
        title: 'The Execution Challenge',
        description: `Across morning turnovers and evening turndowns, 100% adherence requires live clarity between floor attendants and leadership.`
      }
    ]
  };

  // Slide 11: Where we see a fit (Personalized Tailored Solution Fit with Full-Width Callout Banner)
  const slide11: SlideData = {
    id: 'slide-11',
    slideNumber: 11,
    section: 'personalized',
    headerTag: '11 / 12',
    eyebrow: 'WORKING TOGETHER',
    title: `Where we see a direct fit for ${companyName}.`,
    subtitle: 'The execution layer behind your standards — without adding executive travel or extra headcount.',
    footerNote: 'FocusRealm Tailored Solution Fit',
    layoutType: 'fit_columns',
    customBrandTheme: targetPalette,
    cards: [
      {
        id: 's11-c1',
        number: '01',
        title: 'Flawless Execution of Your SOPs',
        description: `Proven checklists delivered directly to staff phones in room sequence, ensuring consistent 5-star delivery across shifts.`
      },
      {
        id: 's11-c2',
        number: '02',
        title: 'Audit-Ready Owner & Brand Proof',
        description: 'Instant, tamper-proof photo verification and timestamps, ready whenever ownership reviews or brand audits require evidence.'
      },
      {
        id: 's11-c3',
        number: '03',
        title: 'Built to Empower the Floor Team',
        description: `Intuitive mobile interface attendants master in under 5 minutes, eliminating paper logs without administrative burden.`
      }
    ]
  };

  // Slide 12: Next step (Personalized Pilot Proposal)
  const slide12: SlideData = {
    id: 'slide-12',
    slideNumber: 12,
    section: 'personalized',
    headerTag: '12 / 12',
    eyebrow: 'NEXT STEP',
    title: 'We would be glad to begin with one property.',
    subtitle: `With your permission, we would like to arrange a demonstration at a property of your choosing, alongside the manager and one member of the team.`,
    footerNote: 'Thank you for your time. We welcome the chance to work alongside you.',
    layoutType: 'pilot_steps',
    customBrandTheme: targetPalette,
    cards: [
      {
        id: 's12-c1',
        number: '1',
        title: 'A property and a week that suit you',
        description: 'Chosen entirely by your team — whether a high-occupancy resort or boutique property.'
      },
      {
        id: 's12-c2',
        number: '2',
        title: 'One manager and one team member',
        description: 'A focused, non-disruptive footprint to evaluate usability directly on the floor.'
      },
      {
        id: 's12-c3',
        number: '3',
        title: 'Live shift run together in person',
        description: 'Experience room assignment, task confirmation, and supervisor review in live operation.'
      }
    ]
  };

  const deck: PresentationDeck = {
    id: `deck-${Date.now()}`,
    companyName,
    websiteUrl: dossier.websiteUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    companyDossier: dossier,
    slides: [
      slide1,
      slide2,
      slide3,
      slide4,
      slide5,
      slide6,
      slide7,
      slide8,
      slide9,
      slide10,
      slide11,
      slide12
    ],
    theme: {
      focusRealmPalette: corePalette,
      targetBrandPalette: targetPalette
    }
  };

  // Validate every slide against canonical constraints
  deck.slides.forEach(slide => {
    const canonical = toCanonicalSlide(slide, deck);
    if (canonical.metadata?.warnings && canonical.metadata.warnings.length > 0) {
      console.warn(`[Deck Validation Warning - Slide ${slide.slideNumber}]:`, canonical.metadata.warnings);
    }
  });

  return deck;
}

/**
 * Regenerate a single slide with AI instructions or custom modifications
 * while strictly conforming to canonical layout constraints
 */
export function regenerateSingleSlide(
  currentSlide: SlideData,
  dossier: CompanyDossier,
  instructions?: string
): SlideData {
  const updatedSlide: SlideData = {
    ...currentSlide,
    version: (currentSlide.version || 1) + 1,
    lastEditedAt: new Date().toISOString()
  };

  if (instructions && instructions.trim()) {
    const lower = instructions.toLowerCase();
    if (lower.includes('shorter') || lower.includes('concise')) {
      updatedSlide.cards = updatedSlide.cards.map(c => ({
        ...c,
        description: c.description.split('.')[0] + '.'
      }));
    } else if (lower.includes('metric') || lower.includes('numbers')) {
      updatedSlide.cards = updatedSlide.cards.map((c, i) => ({
        ...c,
        badge: c.badge || `Outcome 0${i + 1}`
      }));
    } else if (lower.includes('title')) {
      updatedSlide.title = `${updatedSlide.title} (Tailored for ${dossier.name})`.slice(0, 80);
    }
  }

  // Enforce slot-based character bounds to prevent visual overflow
  updatedSlide.title = updatedSlide.title.slice(0, 85);
  if (updatedSlide.subtitle) {
    updatedSlide.subtitle = updatedSlide.subtitle.slice(0, 160);
  }
  updatedSlide.cards = updatedSlide.cards.map(c => ({
    ...c,
    title: c.title.slice(0, 60),
    description: c.description.slice(0, 180)
  }));

  return updatedSlide;
}
