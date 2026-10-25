export interface BrandPalette {
  primary: string;       // e.g. '#1e40af' or hotel primary
  secondary: string;     // e.g. '#0f172a' or slate-900
  accent: string;        // e.g. '#2563eb' or gold/emerald
  background: string;    // e.g. '#f8fafc'
  surface: string;       // e.g. '#ffffff'
  text: string;          // e.g. '#0f172a'
  textMuted: string;     // e.g. '#64748b'
  border: string;        // e.g. '#e2e8f0'
  isCustomized?: boolean;
}

export interface ResearchSource {
  title: string;
  url: string;
  domain: string;
  snippet: string;
  accessedAt: string;
  category: 'official_site' | 'news_press' | 'property_page' | 'uploaded_doc' | 'industry_report';
}

export interface ResearchFact {
  id: string;
  statement: string;
  type: 'verified_fact' | 'inferred_hypothesis';
  sourceUrl?: string;
  sourceTitle?: string;
  relevance: string;
}

export interface CompanyDossier {
  name: string;
  websiteUrl?: string;
  tagline?: string;
  businessModel: string; // e.g. "Hospitality Management & Advisory", "Luxury Resort Operator"
  properties: Array<{
    name: string;
    location: string;
    type: string;        // e.g. "Resort & Spa", "Private Villa", "Boutique Hotel"
    notes?: string;
  }>;
  operationalContext: string[];
  brandPalette: BrandPalette;
  logoUrl?: string;
  sources: ResearchSource[];
  factsAndHypotheses: ResearchFact[];
  targetAudience?: string;
  userNotes?: string;
}

export interface SlideContentCard {
  id: string;
  number?: string | number;
  title: string;
  description: string;
  type?: 'verified_fact' | 'inferred_hypothesis' | 'normal';
  badge?: string;
  sourceUrl?: string;
  imageUrl?: string;
  imageCaption?: string;
}

export interface SlideData {
  id: string;
  slideNumber: number; // 1 to 8
  section: 'focusrealm_core' | 'personalized';
  title: string;
  subtitle: string;
  headerTag?: string;
  eyebrow?: string;
  footerNote?: string;
  cards: SlideContentCard[];
  layoutType: 
    | 'intro_title'        // Slide 1: Executive Cover
    | 'team_portraits'     // Slide 2: People Leading / Leadership (Circular Avatars)
    | 'advisors_list'      // Slide 3: Mentors & Advisors (Circular Avatars)
    | 'grid_six'           // Slide 4: Challenges & Slide 9: Outcomes
    | 'workflow_overview'  // Slide 5: How Mise Works (4-Step Progression)
    | 'workflow_screens'   // Legacy compatibility
    | 'staff_experience'   // Slide 6: On the Floor (Staff Mobile App Hero)
    | 'manager_experience' // Slide 7: Supervision (Manager Dashboard Hero)
    | 'author_experience'  // Slide 8: Author Portal (SOP Creation & Publishing)
    | 'company_overview'   // Slide 10: Understanding Your Business
    | 'opportunity_cards'  // Slide 11: Operational Opportunity
    | 'fit_columns'        // Slide 12: Tailored Solution Fit
    | 'pilot_steps';       // Slide 13: Proposed Next Step
  customBrandTheme?: BrandPalette; // Used for slides 5-8
  isRegenerating?: boolean;
  version?: number;
  lastEditedAt?: string;
}

export interface PresentationDeck {
  id: string;
  companyName: string;
  websiteUrl?: string;
  createdAt: string;
  updatedAt: string;
  companyDossier: CompanyDossier;
  slides: SlideData[];
  theme: {
    focusRealmPalette: BrandPalette;
    targetBrandPalette: BrandPalette;
  };
}

export interface GenerateDeckRequest {
  companyName: string;
  websiteUrl?: string;
  userNotes?: string;
  uploadedText?: string;
  apiKey?: string;
}
