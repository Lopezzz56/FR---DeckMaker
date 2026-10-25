import { PresentationDeck, SlideData, BrandPalette } from '../types/presentation.js';
import { 
  CanonicalSlide, 
  DesignTokens, 
  LAYOUT_CONSTRAINTS 
} from '../types/canonicalSlide.js';

export function resolveDesignTokens(slide: SlideData, deck: PresentationDeck): DesignTokens {
  const isPersonalized = slide.section === 'personalized';
  const core = deck.theme.focusRealmPalette;
  const target = slide.customBrandTheme || deck.theme.targetBrandPalette;

  const palette: BrandPalette = {
    primary: isPersonalized && target ? target.primary : core.primary,
    accent: isPersonalized && target ? target.accent : core.accent,
    background: isPersonalized && target ? (target.background || '#f8fafc') : (core.background || '#f5f2e9'),
    surface: core.surface || '#ffffff',
    border: isPersonalized && target ? (target.border || '#e2e8f0') : (core.border || '#d8d2c4'),
    text: core.text || '#0f172a',
    textMuted: core.textMuted || '#64748b',
    secondary: core.secondary || '#173d45'
  };

  return {
    palette,
    fontFamily: {
      serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
      sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
    },
    spacing: {
      slidePadding: '40px',
      itemGap: '20px'
    },
    radii: {
      card: '16px',
      media: '14px',
      badge: '6px'
    }
  };
}

export function toCanonicalSlide(slide: SlideData, deck: PresentationDeck): CanonicalSlide {
  const tokens = resolveDesignTokens(slide, deck);
  const totalSlides = deck.slides.length;
  const formattedNum = slide.slideNumber < 10 ? `0${slide.slideNumber}` : `${slide.slideNumber}`;
  const formattedTotal = totalSlides < 10 ? `0${totalSlides}` : `${totalSlides}`;
  const isPersonalized = slide.section === 'personalized';

  const header = {
    eyebrow: slide.eyebrow || 'FOCUSREALM SERVICE EXECUTION',
    title: slide.title,
    subtitle: slide.subtitle,
    headerTag: slide.headerTag || `${formattedNum} / ${formattedTotal}`
  };

  const footer = {
    leftNote: slide.footerNote || 'FocusRealm Service Execution Platform',
    rightNote: isPersonalized ? `Prepared for ${deck.companyName}` : 'FocusRealm • Mise Hotel'
  };

  let layoutPayload: CanonicalSlide['layout'];

  switch (slide.layoutType) {
    case 'staff_experience':
    case 'manager_experience':
    case 'author_experience': {
      const heroCard = slide.cards.find(c => Boolean(c.imageUrl)) || slide.cards[0] || {
        id: 'fallback-hero',
        title: slide.title,
        description: slide.subtitle
      };
      const points = slide.cards.filter(c => c.id !== heroCard.id);

      const deviceFrame = slide.layoutType === 'staff_experience' 
        ? 'mobile' 
        : slide.layoutType === 'manager_experience' 
          ? 'desktop' 
          : 'browser';

      layoutPayload = {
        type: 'hero_media_points',
        payload: {
          media: {
            imageUrl: heroCard.imageUrl || '',
            caption: heroCard.imageCaption || (deviceFrame === 'mobile' ? 'Live shift view for attendants' : 'Real-time floor supervision dashboard'),
            deviceFrame,
            aspectRatio: deviceFrame === 'mobile' ? 'portrait' : 'landscape'
          },
          points: points.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            badge: p.badge
          }))
        }
      };
      break;
    }

    case 'team_portraits':
    case 'advisors_list': {
      layoutPayload = {
        type: 'avatar_roster',
        payload: {
          members: slide.cards.map(c => ({
            id: c.id,
            name: c.title,
            role: c.badge || 'Leadership',
            bio: c.description,
            imageUrl: c.imageUrl || '',
            badge: c.badge
          }))
        }
      };
      break;
    }

    case 'workflow_overview':
    case 'workflow_screens': {
      layoutPayload = {
        type: 'stepper_workflow',
        payload: {
          steps: slide.cards.map((c, idx) => ({
            stepNumber: typeof c.number === 'number' ? c.number : idx + 1,
            title: c.title,
            description: c.description,
            badge: c.badge
          })),
          banner: {
            statusDot: true,
            title: 'Live Platform Deployment:',
            description: 'Mise Hotel Floor System runs live across shifts with instant sync and tamper-proof audit trails.',
            linkText: 'fr2-b6s.pages.dev',
            linkUrl: 'https://fr2-b6s.pages.dev/'
          }
        }
      };
      break;
    }

    case 'intro_title': {
      layoutPayload = {
        type: 'hero_intro',
        payload: {
          tagline: slide.subtitle,
          pillars: slide.cards.map(c => ({
            title: c.title,
            description: c.description,
            badge: c.badge
          }))
        }
      };
      break;
    }

    case 'grid_six': {
      layoutPayload = {
        type: 'card_grid',
        payload: {
          columns: 3,
          cards: slide.cards.map(c => ({
            id: c.id,
            number: c.number,
            badge: c.badge,
            title: c.title,
            description: c.description
          }))
        }
      };
      break;
    }

    case 'fit_columns': {
      layoutPayload = {
        type: 'card_grid',
        payload: {
          columns: 3,
          cards: slide.cards.map(c => ({
            id: c.id,
            number: c.number,
            badge: c.badge,
            title: c.title,
            description: c.description
          })),
          bannerCallout: {
            text: 'We are not asking for a commitment across the portfolio. We would be glad to earn your trust at a single property.',
            style: 'primary'
          }
        }
      };
      break;
    }

    case 'pilot_steps': {
      layoutPayload = {
        type: 'card_grid',
        payload: {
          columns: 3,
          cards: slide.cards.map(c => ({
            id: c.id,
            number: c.number,
            badge: c.badge,
            title: c.title,
            description: c.description,
            highlight: true
          }))
        }
      };
      break;
    }

    default: {
      // Handles intro_title, company_overview, opportunity_cards, etc.
      const cols = slide.cards.length === 4 ? 4 : slide.cards.length === 2 ? 2 : 3;
      layoutPayload = {
        type: 'card_grid',
        payload: {
          columns: cols,
          cards: slide.cards.map(c => ({
            id: c.id,
            number: c.number,
            badge: c.badge,
            title: c.title,
            description: c.description,
            sourceUrl: c.sourceUrl
          }))
        }
      };
      break;
    }
  }

  const canonical: CanonicalSlide = {
    id: slide.id,
    slideNumber: slide.slideNumber,
    section: slide.section,
    header,
    footer,
    layout: layoutPayload,
    tokens
  };

  // Run validation
  const validation = validateCanonicalSlide(canonical);
  canonical.metadata = {
    lastValidatedAt: new Date().toISOString(),
    warnings: validation.warnings
  };

  return canonical;
}

export interface SlideValidationResult {
  isValid: boolean;
  warnings: string[];
}

export function validateCanonicalSlide(slide: CanonicalSlide): SlideValidationResult {
  const warnings: string[] = [];

  // 1. Header checks
  if (slide.header.title.length > 80) {
    warnings.push(`Header title exceeds 80 characters (${slide.header.title.length} chars)`);
  }
  if (slide.header.subtitle && slide.header.subtitle.length > 180) {
    warnings.push(`Header subtitle exceeds 180 characters (${slide.header.subtitle.length} chars)`);
  }

  // 2. Layout-specific checks
  switch (slide.layout.type) {
    case 'hero_media_points': {
      const { media, points } = slide.layout.payload;
      const c = LAYOUT_CONSTRAINTS.hero_media_points;
      if (!media.imageUrl) {
        warnings.push('Hero media layout is missing an image asset');
      }
      if (points.length > c.maxPoints) {
        warnings.push(`Hero media has ${points.length} points, exceeding max recommended (${c.maxPoints})`);
      }
      points.forEach((p, idx) => {
        if (p.title.length > c.maxTitleChars) {
          warnings.push(`Point ${idx + 1} title exceeds ${c.maxTitleChars} chars (${p.title.length})`);
        }
        if (p.description.length > c.maxDescChars) {
          warnings.push(`Point ${idx + 1} description exceeds ${c.maxDescChars} chars (${p.description.length})`);
        }
      });
      break;
    }

    case 'card_grid': {
      const { cards, columns } = slide.layout.payload;
      const c = columns === 6 ? LAYOUT_CONSTRAINTS.card_grid_6 : LAYOUT_CONSTRAINTS.card_grid_3;
      cards.forEach((card, idx) => {
        if (card.title.length > c.maxTitleChars) {
          warnings.push(`Card ${idx + 1} title exceeds ${c.maxTitleChars} chars (${card.title.length})`);
        }
        if (card.description.length > c.maxDescChars) {
          warnings.push(`Card ${idx + 1} description exceeds ${c.maxDescChars} chars (${card.description.length})`);
        }
      });
      break;
    }

    case 'avatar_roster': {
      const { members } = slide.layout.payload;
      const c = LAYOUT_CONSTRAINTS.avatar_roster;
      if (members.length > c.maxMembers) {
        warnings.push(`Avatar roster has ${members.length} members, exceeding max (${c.maxMembers})`);
      }
      members.forEach((m, idx) => {
        if (!m.imageUrl) {
          warnings.push(`Member ${idx + 1} (${m.name}) is missing an avatar image`);
        }
        if (m.bio.length > c.maxBioChars) {
          warnings.push(`Member ${idx + 1} bio exceeds ${c.maxBioChars} chars (${m.bio.length})`);
        }
      });
      break;
    }

    case 'stepper_workflow': {
      const { steps } = slide.layout.payload;
      const c = LAYOUT_CONSTRAINTS.stepper_workflow;
      if (steps.length !== c.stepsCount) {
        warnings.push(`Stepper workflow expects exactly ${c.stepsCount} steps, found ${steps.length}`);
      }
      steps.forEach((s, idx) => {
        if (s.title.length > c.maxTitleChars) {
          warnings.push(`Step ${idx + 1} title exceeds ${c.maxTitleChars} chars (${s.title.length})`);
        }
      });
      break;
    }
  }

  return {
    isValid: warnings.length === 0,
    warnings
  };
}
