/**
 * Canonical 1920 x 1080 Logical Slide Geometry System
 * Single source of truth for all slide dimensions, slots, and coordinates.
 */
export const SLIDE_GEOMETRY = {
  // Logical Canvas Dimensions (16:9 Widescreen)
  CANVAS_WIDTH: 1920,
  CANVAS_HEIGHT: 1080,
  ASPECT_RATIO: 16 / 9,

  // Outer Canvas Margins
  MARGIN_X: 100,
  MARGIN_TOP: 64,
  MARGIN_BOTTOM: 48,

  // Header Region (top 64px to 220px)
  HEADER_HEIGHT: 156,
  HEADER_GAP: 16,

  // Content Region (Available slot for layouts)
  // 1080 - 64 (top) - 156 (header) - 20 (gap) - 48 (footer) - 16 (gap) = 776px
  CONTENT_TOP: 240,
  CONTENT_HEIGHT: 770,
  CONTENT_WIDTH: 1720, // 1920 - (100 * 2)

  // Footer Region (bottom 48px)
  FOOTER_HEIGHT: 48,

  // Standard Archetype Constraints
  HERO: {
    MEDIA_COL_SPAN: 5,
    TEXT_COL_SPAN: 7,
    PHONE_MAX_WIDTH: 360,
    PHONE_MAX_HEIGHT: 640,
    DESKTOP_MAX_WIDTH: 920,
    DESKTOP_MAX_HEIGHT: 580,
  },

  GRID: {
    CARD_GAP: 28,
    CARD_PADDING: 32,
    MAX_CARD_HEIGHT: 700,
  },

  STEPPER: {
    STEP_GAP: 24,
    STEP_PADDING: 28,
    BANNER_HEIGHT: 64,
  },

  ROSTER: {
    AVATAR_SIZE: 170,
    CARD_GAP: 36,
    CARD_PADDING: 32,
  }
} as const;

export type SlideGeometry = typeof SLIDE_GEOMETRY;
