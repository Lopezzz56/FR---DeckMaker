import { BrandPalette } from './presentation';

export type CanonicalLayoutType = 
  | 'hero_media_points'   // Single prominent media (mobile/desktop/clean) + editorial vertical pointers
  | 'card_grid'           // Structured 2, 3, 4, or 6-card column or matrix layout
  | 'avatar_roster'       // Leadership & advisory circles with names, roles, and bios
  | 'stepper_workflow'    // 4-step sequence + optional live deployment banner
  | 'metrics_overview'    // Highlight metrics & property cards
  | 'split_content';      // Two asymmetric content columns

export interface MediaSlot {
  imageUrl: string;
  caption?: string;
  deviceFrame?: 'mobile' | 'desktop' | 'browser' | 'clean' | 'none';
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  altText?: string;
}

export interface PointSlot {
  id: string;
  title: string;
  description: string;
  badge?: string;
  accentIcon?: string;
}

export interface CardSlot {
  id: string;
  number?: string | number;
  badge?: string;
  title: string;
  description: string;
  highlight?: boolean;
  sourceUrl?: string;
}

export interface MemberSlot {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  badge?: string;
}

export interface WorkflowStepSlot {
  stepNumber: number;
  title: string;
  description: string;
  badge?: string;
}

export interface WorkflowBannerSlot {
  statusDot?: boolean;
  title: string;
  description: string;
  linkText?: string;
  linkUrl?: string;
}

export interface SlideHeaderSlot {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  headerTag?: string; // e.g. "01 / 12"
}

export interface SlideFooterSlot {
  leftNote?: string;
  rightNote?: string;
}

/**
 * Strongly typed slot data payloads per layout archetype
 */
export interface HeroMediaPointsPayload {
  media: MediaSlot;
  points: PointSlot[];
}

export interface CardGridPayload {
  columns: 2 | 3 | 4 | 6;
  cards: CardSlot[];
  bannerCallout?: {
    text: string;
    style?: 'primary' | 'subtle';
  };
}

export interface AvatarRosterPayload {
  members: MemberSlot[];
}

export interface StepperWorkflowPayload {
  steps: WorkflowStepSlot[];
  banner?: WorkflowBannerSlot;
}

export type LayoutPayload = 
  | { type: 'hero_media_points'; payload: HeroMediaPointsPayload }
  | { type: 'card_grid'; payload: CardGridPayload }
  | { type: 'avatar_roster'; payload: AvatarRosterPayload }
  | { type: 'stepper_workflow'; payload: StepperWorkflowPayload };

/**
 * Design Tokens for presentation slides
 */
export interface DesignTokens {
  palette: BrandPalette;
  fontFamily: {
    serif: string;
    sans: string;
    mono: string;
  };
  spacing: {
    slidePadding: string;
    itemGap: string;
  };
  radii: {
    card: string;
    media: string;
    badge: string;
  };
}

/**
 * Canonical Slide Schema
 */
export interface CanonicalSlide {
  id: string;
  slideNumber: number;
  section: 'focusrealm_core' | 'personalized';
  header: SlideHeaderSlot;
  footer: SlideFooterSlot;
  layout: LayoutPayload;
  tokens: DesignTokens;
  metadata?: {
    lastValidatedAt?: string;
    warnings?: string[];
  };
}

/**
 * Layout Constraint Definitions (prevents overflow and enforces Gamma-like rigor)
 */
export const LAYOUT_CONSTRAINTS = {
  hero_media_points: {
    maxPoints: 4,
    minPoints: 1,
    maxTitleChars: 45,
    maxDescChars: 130,
    maxCaptionChars: 65,
  },
  card_grid_3: {
    cardsCount: 3,
    maxTitleChars: 40,
    maxDescChars: 160,
  },
  card_grid_6: {
    cardsCount: 6,
    maxTitleChars: 35,
    maxDescChars: 110,
  },
  avatar_roster: {
    maxMembers: 3,
    maxNameChars: 30,
    maxRoleChars: 40,
    maxBioChars: 140,
  },
  stepper_workflow: {
    stepsCount: 4,
    maxTitleChars: 35,
    maxDescChars: 120,
  },
};
