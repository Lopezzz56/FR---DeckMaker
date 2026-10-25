import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';
import { PresentationDeck } from '../types/presentation.js';
import { toCanonicalSlide } from './canonicalAdapter.js';

const require = createRequire(import.meta.url);
const pptxgen = require('pptxgenjs');

import { 
  CanonicalSlide, 
  HeroMediaPointsPayload, 
  CardGridPayload, 
  AvatarRosterPayload, 
  StepperWorkflowPayload,
  DesignTokens 
} from '../types/canonicalSlide.js';

// Helper to remove '#' from hex string for pptxgenjs
function cleanHex(hex?: string, defaultHex: string = '102F35'): string {
  if (!hex) return defaultHex;
  return hex.replace('#', '').trim();
}

/**
 * Robust asset locator looking across server assets, client public, and extracted assets
 */
function resolveAssetPath(imagePath?: string): string | null {
  if (!imagePath) return null;
  const fileName = path.basename(imagePath);
  const pngName = fileName.replace(/\.jpe?g$/i, '.png');
  const possibleDirs = [
    path.resolve(process.cwd(), 'assets'),
    path.resolve(process.cwd(), 'server/assets'),
    path.resolve(process.cwd(), '../client/public/assets'),
    path.resolve(process.cwd(), 'client/public/assets'),
    path.resolve(process.cwd(), 'extracted_assets'),
    path.resolve(process.cwd(), '../extracted_assets')
  ];

  // Check for png version first (transparent portraits or icons)
  if (pngName !== fileName) {
    for (const dir of possibleDirs) {
      const fullPath = path.join(dir, pngName);
      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }
  }

  for (const dir of possibleDirs) {
    const fullPath = path.join(dir, fileName);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Layout Archetype Renderers for PPTX
// ---------------------------------------------------------------------------

function renderPptxHeroMediaPoints(
  slide: any, 
  payload: HeroMediaPointsPayload, 
  tokens: DesignTokens, 
  startX: number, 
  totalWidth: number
) {
  const { media, points } = payload;
  const { palette } = tokens;
  const isMobile = media.deviceFrame === 'mobile';
  const startY = 2.25;
  const assetPath = resolveAssetPath(media.imageUrl);

  const primary = cleanHex(palette.primary, '102F35');
  const accent = cleanHex(palette.accent, '3DB89E');
  const cardFill = cleanHex(palette.surface, 'FFFFFF');
  const cardBorder = cleanHex(palette.border, 'D8D2C4');
  const textColor = cleanHex(palette.text, '102F35');
  const textMuted = cleanHex(palette.textMuted, '64748B');

  if (isMobile) {
    // Left column: Phone frame
    const phoneW = 3.2;
    const phoneH = 4.4;
    const phoneX = startX + 0.3;

    // Phone casing
    slide.addShape('roundRect', {
      x: phoneX,
      y: startY,
      w: phoneW,
      h: phoneH,
      rectRadius: 0.18,
      fill: { color: cardFill },
      line: { color: primary, width: 2.5 }
    });

    // Screen area
    if (assetPath) {
      slide.addImage({
        path: assetPath,
        x: phoneX + 0.15,
        y: startY + 0.15,
        w: phoneW - 0.3,
        h: phoneH - 0.3,
        sizing: { type: 'contain', w: phoneW - 0.3, h: phoneH - 0.3 }
      });
    }

    // Optional phone caption
    if (media.caption) {
      slide.addText(media.caption, {
        x: phoneX,
        y: startY + phoneH + 0.08,
        w: phoneW,
        h: 0.28,
        fontSize: 9,
        fontFace: 'Arial',
        color: textMuted,
        align: 'center',
        italic: true
      });
    }

    // Right column: Points
    const pointsX = startX + 4.1;
    const pointsW = totalWidth - 4.1;
    const count = points.length;
    const gap = 0.22;
    const pointH = Math.min(1.2, (phoneH - (count - 1) * gap) / count);

    points.forEach((point, idx) => {
      const pY = startY + idx * (pointH + gap);

      slide.addShape('roundRect', {
        x: pointsX,
        y: pY,
        w: pointsW,
        h: pointH,
        rectRadius: 0.08,
        fill: { color: cardFill },
        line: { color: cardBorder, width: 1 }
      });

      // Left Accent Strip
      slide.addShape('rect', {
        x: pointsX,
        y: pY,
        w: 0.07,
        h: pointH,
        fill: { color: accent }
      });

      // Point Badge
      if (point.badge) {
        slide.addText(point.badge.toUpperCase(), {
          x: pointsX + 0.25,
          y: pY + 0.1,
          w: pointsW - 0.5,
          h: 0.22,
          fontSize: 8.5,
          fontFace: 'Arial',
          color: accent,
          bold: true
        });
      }

      // Title
      slide.addText(point.title, {
        x: pointsX + 0.25,
        y: pY + (point.badge ? 0.32 : 0.15),
        w: pointsW - 0.5,
        h: 0.32,
        fontSize: 12.5,
        fontFace: 'Georgia',
        color: textColor,
        bold: true
      });

      // Description
      slide.addText(point.description, {
        x: pointsX + 0.25,
        y: pY + (point.badge ? 0.64 : 0.48),
        w: pointsW - 0.5,
        h: pointH - (point.badge ? 0.7 : 0.55),
        fontSize: 9.5,
        fontFace: 'Arial',
        color: textMuted,
        lineSpacingMultiple: 1.15
      });
    });
  } else {
    // Desktop / Browser frame
    const browserW = 6.4;
    const browserH = 4.3;
    const browserX = startX;

    // Window shell
    slide.addShape('roundRect', {
      x: browserX,
      y: startY,
      w: browserW,
      h: browserH,
      rectRadius: 0.08,
      fill: { color: cardFill },
      line: { color: cardBorder, width: 1.5 }
    });

    // Top control bar
    slide.addShape('rect', {
      x: browserX,
      y: startY,
      w: browserW,
      h: 0.32,
      fill: { color: 'F1F5F9' }
    });

    // Browser dots
    ['EF4444', 'F59E0B', '10B981'].forEach((dotColor, i) => {
      slide.addShape('roundRect', {
        x: browserX + 0.15 + i * 0.18,
        y: startY + 0.11,
        w: 0.1,
        h: 0.1,
        rectRadius: 0.5,
        fill: { color: dotColor }
      });
    });

    // URL tag
    slide.addText('mise.hotel / live-supervision', {
      x: browserX + 0.8,
      y: startY + 0.06,
      w: 4.0,
      h: 0.2,
      fontSize: 8.5,
      fontFace: 'Courier New',
      color: '64748B'
    });

    // Screen area
    if (assetPath) {
      slide.addImage({
        path: assetPath,
        x: browserX + 0.05,
        y: startY + 0.35,
        w: browserW - 0.1,
        h: browserH - 0.4,
        sizing: { type: 'contain', w: browserW - 0.1, h: browserH - 0.4 }
      });
    }

    // Right column: Points
    const pointsX = startX + 6.8;
    const pointsW = totalWidth - 6.8;
    const count = points.length;
    const gap = 0.22;
    const pointH = Math.min(1.25, (browserH - (count - 1) * gap) / count);

    points.forEach((point, idx) => {
      const pY = startY + idx * (pointH + gap);

      slide.addShape('roundRect', {
        x: pointsX,
        y: pY,
        w: pointsW,
        h: pointH,
        rectRadius: 0.08,
        fill: { color: cardFill },
        line: { color: cardBorder, width: 1 }
      });

      slide.addShape('rect', {
        x: pointsX,
        y: pY,
        w: 0.07,
        h: pointH,
        fill: { color: primary }
      });

      if (point.badge) {
        slide.addText(point.badge.toUpperCase(), {
          x: pointsX + 0.22,
          y: pY + 0.1,
          w: pointsW - 0.44,
          h: 0.22,
          fontSize: 8.5,
          fontFace: 'Arial',
          color: accent,
          bold: true
        });
      }

      slide.addText(point.title, {
        x: pointsX + 0.22,
        y: pY + (point.badge ? 0.32 : 0.15),
        w: pointsW - 0.44,
        h: 0.32,
        fontSize: 12.5,
        fontFace: 'Georgia',
        color: textColor,
        bold: true
      });

      slide.addText(point.description, {
        x: pointsX + 0.22,
        y: pY + (point.badge ? 0.64 : 0.48),
        w: pointsW - 0.44,
        h: pointH - (point.badge ? 0.7 : 0.55),
        fontSize: 9.5,
        fontFace: 'Arial',
        color: textMuted,
        lineSpacingMultiple: 1.15
      });
    });
  }
}

function renderPptxCardGrid(
  slide: any, 
  payload: CardGridPayload, 
  tokens: DesignTokens, 
  startX: number, 
  totalWidth: number
) {
  const { cards, columns, bannerCallout } = payload;
  const { palette } = tokens;
  const startY = 2.25;

  const primary = cleanHex(palette.primary, '102F35');
  const accent = cleanHex(palette.accent, '3DB89E');
  const cardFill = cleanHex(palette.surface, 'FFFFFF');
  const cardBorder = cleanHex(palette.border, 'D8D2C4');
  const textColor = cleanHex(palette.text, '102F35');
  const textMuted = cleanHex(palette.textMuted, '64748B');

  // Handle 6-card 2x3 grid
  if (cards.length === 6 || columns === 6) {
    const cols = 3;
    const rows = 2;
    const gapX = 0.28;
    const gapY = 0.22;
    const cardW = (totalWidth - (cols - 1) * gapX) / cols;
    const cardH = 2.0;

    cards.forEach((card, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const cX = startX + col * (cardW + gapX);
      const cY = startY + row * (cardH + gapY);

      slide.addShape('roundRect', {
        x: cX,
        y: cY,
        w: cardW,
        h: cardH,
        rectRadius: 0.08,
        fill: { color: cardFill },
        line: { color: cardBorder, width: 1 }
      });

      // Accent bar
      slide.addShape('rect', {
        x: cX,
        y: cY,
        w: cardW,
        h: 0.06,
        fill: { color: primary }
      });

      // Number / Badge
      if (card.number) {
        const numCircleSize = 0.38;
        const numCircleX = cX + 0.2;
        const numCircleY = cY + 0.16;
        slide.addShape('roundRect', {
          x: numCircleX,
          y: numCircleY,
          w: numCircleSize,
          h: numCircleSize,
          rectRadius: numCircleSize / 2,
          fill: { color: 'F1F5F9' },
          line: { color: cardBorder, width: 1 }
        });
        slide.addText(String(card.number), {
          x: numCircleX - 0.06,
          y: numCircleY + 0.01,
          w: numCircleSize + 0.12,
          h: numCircleSize,
          fontSize: 9.5,
          fontFace: 'Arial',
          color: primary,
          bold: true,
          align: 'center',
          valign: 'middle',
          margin: 0,
          wrap: false
        });
      } else if (card.badge) {
        slide.addText(card.badge.toUpperCase(), {
          x: cX + 0.2,
          y: cY + 0.18,
          w: cardW - 0.4,
          h: 0.22,
          fontSize: 8.5,
          fontFace: 'Arial',
          color: accent,
          bold: true
        });
      }

      const titleY = (card.number || card.badge) ? cY + 0.54 : cY + 0.2;
      slide.addText(card.title, {
        x: cX + 0.2,
        y: titleY,
        w: cardW - 0.4,
        h: 0.4,
        fontSize: 11.5,
        fontFace: 'Georgia',
        color: textColor,
        bold: true
      });

      slide.addText(card.description, {
        x: cX + 0.2,
        y: titleY + 0.42,
        w: cardW - 0.4,
        h: cardH - (titleY - cY) - 0.48,
        fontSize: 9,
        fontFace: 'Arial',
        color: textMuted,
        lineSpacingMultiple: 1.15
      });
    });
    return;
  }

  // 1-Row Card Grid (2, 3, or 4 columns)
  const cols = columns || (cards.length === 4 ? 4 : cards.length === 2 ? 2 : 3);
  const gap = 0.32;
  const cardW = (totalWidth - (cols - 1) * gap) / cols;
  const cardH = bannerCallout ? 3.5 : 4.1;

  cards.forEach((card, idx) => {
    const cX = startX + idx * (cardW + gap);

    slide.addShape('roundRect', {
      x: cX,
      y: startY,
      w: cardW,
      h: cardH,
      rectRadius: 0.08,
      fill: { color: cardFill },
      line: { color: cardBorder, width: 1 }
    });

    slide.addShape('rect', {
      x: cX,
      y: startY,
      w: cardW,
      h: 0.08,
      fill: { color: primary }
    });

    if (card.number) {
      const numCircleSize = 0.44;
      const numCircleX = cX + 0.25;
      const numCircleY = startY + 0.22;
      slide.addShape('roundRect', {
        x: numCircleX,
        y: numCircleY,
        w: numCircleSize,
        h: numCircleSize,
        rectRadius: numCircleSize / 2,
        fill: { color: 'F1F5F9' },
        line: { color: cardBorder, width: 1 }
      });
      slide.addText(String(card.number), {
        x: numCircleX - 0.08,
        y: numCircleY + 0.02,
        w: numCircleSize + 0.16,
        h: numCircleSize,
        fontSize: 11,
        fontFace: 'Arial',
        color: primary,
        bold: true,
        align: 'center',
        valign: 'middle',
        margin: 0,
        wrap: false
      });
    } else if (card.badge) {
      slide.addText(card.badge.toUpperCase(), {
        x: cX + 0.25,
        y: startY + 0.22,
        w: cardW - 0.5,
        h: 0.25,
        fontSize: 9.5,
        fontFace: 'Arial',
        color: accent,
        bold: true
      });
    }

    const titleY = (card.number || card.badge) ? startY + 0.72 : startY + 0.3;
    slide.addText(card.title, {
      x: cX + 0.25,
      y: titleY,
      w: cardW - 0.5,
      h: 0.65,
      fontSize: 14,
      fontFace: 'Georgia',
      color: textColor,
      bold: true
    });

    slide.addText(card.description, {
      x: cX + 0.25,
      y: titleY + 0.7,
      w: cardW - 0.5,
      h: cardH - (titleY - startY) - 0.85,
      fontSize: 10,
      fontFace: 'Arial',
      color: textMuted,
      lineSpacingMultiple: 1.2
    });

    if (card.sourceUrl) {
      slide.addText('🔗 Verified Source', {
        x: cX + 0.25,
        y: startY + cardH - 0.38,
        w: cardW - 0.5,
        h: 0.25,
        fontSize: 8.5,
        fontFace: 'Arial',
        color: accent,
        bold: true
      });
    }
  });

  // Reassurance Banner Callout if present
  if (bannerCallout) {
    const bannerY = startY + cardH + 0.25;
    slide.addShape('roundRect', {
      x: startX,
      y: bannerY,
      w: totalWidth,
      h: 0.55,
      rectRadius: 0.08,
      fill: { color: 'F1F5F9' },
      line: { color: cardBorder, width: 1 }
    });

    slide.addText(bannerCallout.text, {
      x: startX + 0.3,
      y: bannerY + 0.12,
      w: totalWidth - 0.6,
      h: 0.32,
      fontSize: 10,
      fontFace: 'Georgia',
      color: primary,
      italic: true,
      align: 'center'
    });
  }
}

function renderPptxHeroIntro(
  slide: any,
  payload: any,
  tokens: DesignTokens,
  startX: number,
  totalWidth: number
) {
  const { pillars = [], tagline } = payload;
  const { palette } = tokens;
  const primary = cleanHex(palette.primary, '102F35');
  const accent = cleanHex(palette.accent, '3DB89E');
  const textColor = cleanHex(palette.text, '102F35');
  const textMuted = cleanHex(palette.textMuted, '64748B');
  const cardBorder = cleanHex(palette.border, 'D8D2C4');

  // 1. Executive Callout Pill
  slide.addShape('roundRect', {
    x: startX,
    y: 2.15,
    w: 3.8,
    h: 0.32,
    rectRadius: 0.16,
    fill: { color: 'E6F4F1' },
    line: { color: accent, width: 1 }
  });
  slide.addText('OPERATIONAL INTEGRITY & VERIFIED SERVICE', {
    x: startX + 0.15,
    y: 2.16,
    w: 3.5,
    h: 0.28,
    fontSize: 8.5,
    fontFace: 'Arial',
    color: primary,
    bold: true,
    charSpacing: 1.5
  });

  // 2. Value Narrative Statement
  slide.addText(
    tagline || 'Built alongside luxury hoteliers to bridge the gap between executive standards and daily floor execution — ensuring accountability, tamper-proof proof, and pristine guest experiences across every shift.',
    {
      x: startX,
      y: 2.68,
      w: totalWidth - 0.8,
      h: 0.95,
      fontSize: 14,
      fontFace: 'Georgia',
      color: textColor,
      lineSpacingMultiple: 1.25
    }
  );

  // 3. Subtle Horizontal Divider
  slide.addShape('rect', {
    x: startX,
    y: 3.85,
    w: totalWidth,
    h: 0.02,
    fill: { color: cardBorder }
  });

  // 4. Three Editorial Value Pillars
  const cols = 3;
  const gap = 0.5;
  const colW = (totalWidth - (cols - 1) * gap) / cols;
  const pillarY = 4.12;

  pillars.forEach((pillar: any, idx: number) => {
    const pX = startX + idx * (colW + gap);

    // Number & Badge Tag
    slide.addText(`0${idx + 1}   ${(pillar.badge || 'CORE VALUE').toUpperCase()}`, {
      x: pX,
      y: pillarY,
      w: colW,
      h: 0.3,
      fontSize: 9.5,
      fontFace: 'Arial',
      color: accent,
      bold: true,
      charSpacing: 1
    });

    // Pillar Title
    slide.addText(pillar.title, {
      x: pX,
      y: pillarY + 0.38,
      w: colW,
      h: 0.45,
      fontSize: 15,
      fontFace: 'Georgia',
      color: textColor,
      bold: true
    });

    // Pillar Description
    slide.addText(pillar.description, {
      x: pX,
      y: pillarY + 0.9,
      w: colW,
      h: 1.2,
      fontSize: 10,
      fontFace: 'Arial',
      color: textMuted,
      lineSpacingMultiple: 1.25
    });

    // Verification check note
    slide.addText('✓ Verified FocusRealm Standard', {
      x: pX,
      y: pillarY + 2.2,
      w: colW,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Arial',
      color: primary,
      bold: true
    });
  });
}

function renderPptxAvatarRoster(
  slide: any, 
  payload: AvatarRosterPayload, 
  tokens: DesignTokens, 
  startX: number, 
  totalWidth: number
) {
  const { members } = payload;
  const { palette } = tokens;
  const startY = 2.15;

  const primary = cleanHex(palette.primary, '102F35');
  const accent = cleanHex(palette.accent, '3DB89E');
  const cardFill = cleanHex(palette.surface, 'FFFFFF');
  const cardBorder = cleanHex(palette.border, 'D8D2C4');
  const textColor = cleanHex(palette.text, '102F35');
  const textMuted = cleanHex(palette.textMuted, '64748B');

  const count = members.length;
  // If 2 members, center them nicely with generous width; if 3, span full totalWidth
  const isTwoCols = count === 2;
  const gap = isTwoCols ? 0.7 : 0.45;
  const rosterWidth = isTwoCols ? totalWidth - 2.0 : totalWidth;
  const rosterStartX = isTwoCols ? startX + 1.0 : startX;
  const cardW = (rosterWidth - (count - 1) * gap) / count;
  const cardH = 4.45;

  members.forEach((member, idx) => {
    const cX = rosterStartX + idx * (cardW + gap);
    const assetPath = resolveAssetPath(member.imageUrl);

    // Card background
    slide.addShape('roundRect', {
      x: cX,
      y: startY,
      w: cardW,
      h: cardH,
      rectRadius: 0.12,
      fill: { color: cardFill },
      line: { color: cardBorder, width: 1.2 }
    });

    // Top accent
    slide.addShape('rect', {
      x: cX,
      y: startY,
      w: cardW,
      h: 0.1,
      fill: { color: primary }
    });

    // Circular portrait
    const avatarSize = 1.65;
    const avatarX = cX + (cardW - avatarSize) / 2;
    const avatarY = startY + 0.35;

    if (assetPath) {
      slide.addImage({
        path: assetPath,
        x: avatarX,
        y: avatarY,
        w: avatarSize,
        h: avatarSize,
        rounding: true
      });
    } else {
      // Clean fallback monogram circle
      slide.addShape('roundRect', {
        x: avatarX,
        y: avatarY,
        w: avatarSize,
        h: avatarSize,
        rectRadius: avatarSize / 2,
        fill: { color: primary }
      });
      const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2);
      slide.addText(initials, {
        x: avatarX,
        y: avatarY + 0.4,
        w: avatarSize,
        h: 0.8,
        fontSize: 18,
        fontFace: 'Georgia',
        color: 'FFFFFF',
        bold: true,
        align: 'center'
      });
    }

    // Role / Badge
    slide.addText(member.role.toUpperCase(), {
      x: cX + 0.2,
      y: avatarY + avatarSize + 0.2,
      w: cardW - 0.4,
      h: 0.28,
      fontSize: 9.5,
      fontFace: 'Arial',
      color: accent,
      bold: true,
      align: 'center'
    });

    // Name
    slide.addText(member.name, {
      x: cX + 0.2,
      y: avatarY + avatarSize + 0.52,
      w: cardW - 0.4,
      h: 0.42,
      fontSize: 16,
      fontFace: 'Georgia',
      color: textColor,
      bold: true,
      align: 'center'
    });

    // Bio
    slide.addText(member.bio, {
      x: cX + 0.35,
      y: avatarY + avatarSize + 0.98,
      w: cardW - 0.7,
      h: 0.85,
      fontSize: 10,
      fontFace: 'Arial',
      color: textMuted,
      lineSpacingMultiple: 1.2,
      align: 'center'
    });

    // Bottom note
    slide.addText('FOCUSREALM EXECUTIVE', {
      x: cX + 0.2,
      y: startY + cardH - 0.38,
      w: cardW - 0.4,
      h: 0.25,
      fontSize: 8.5,
      fontFace: 'Arial',
      color: primary,
      bold: true,
      align: 'center',
      charSpacing: 1.5
    });
  });
}

function renderPptxStepperWorkflow(
  slide: any, 
  payload: StepperWorkflowPayload, 
  tokens: DesignTokens, 
  startX: number, 
  totalWidth: number
) {
  const { steps, banner } = payload;
  const { palette } = tokens;
  const startY = 2.25;

  const primary = cleanHex(palette.primary, '102F35');
  const accent = cleanHex(palette.accent, '3DB89E');
  const cardFill = cleanHex(palette.surface, 'FFFFFF');
  const cardBorder = cleanHex(palette.border, 'D8D2C4');
  const textColor = cleanHex(palette.text, '102F35');
  const textMuted = cleanHex(palette.textMuted, '64748B');

  const count = steps.length;
  const gap = 0.25;
  const stepW = (totalWidth - (count - 1) * gap) / count;
  const stepH = 3.2;

  // Connecting line behind indicators
  slide.addShape('rect', {
    x: startX + 0.4,
    y: startY + 0.4,
    w: totalWidth - 0.8,
    h: 0.04,
    fill: { color: 'CBD5E1' }
  });

  steps.forEach((step, idx) => {
    const sX = startX + idx * (stepW + gap);

    // Step Indicator Circle
    slide.addShape('roundRect', {
      x: sX + (stepW - 0.44) / 2,
      y: startY + 0.18,
      w: 0.44,
      h: 0.44,
      rectRadius: 0.22,
      fill: { color: primary },
      line: { color: cardFill, width: 2 }
    });
    slide.addText(String(step.stepNumber), {
      x: sX + (stepW - 0.6) / 2,
      y: startY + 0.2,
      w: 0.6,
      h: 0.44,
      fontSize: 10.5,
      fontFace: 'Arial',
      color: 'FFFFFF',
      bold: true,
      align: 'center',
      valign: 'middle',
      margin: 0,
      wrap: false
    });

    // Step Card
    slide.addShape('roundRect', {
      x: sX,
      y: startY + 0.75,
      w: stepW,
      h: stepH - 0.75,
      rectRadius: 0.08,
      fill: { color: cardFill },
      line: { color: cardBorder, width: 1 }
    });

    slide.addShape('rect', {
      x: sX,
      y: startY + 0.75,
      w: stepW,
      h: 0.06,
      fill: { color: primary }
    });

    if (step.badge) {
      slide.addText(step.badge.toUpperCase(), {
        x: sX + 0.18,
        y: startY + 0.9,
        w: stepW - 0.36,
        h: 0.2,
        fontSize: 8,
        fontFace: 'Arial',
        color: accent,
        bold: true
      });
    }

    const titleY = step.badge ? startY + 1.15 : startY + 0.95;
    slide.addText(step.title, {
      x: sX + 0.18,
      y: titleY,
      w: stepW - 0.36,
      h: 0.5,
      fontSize: 12,
      fontFace: 'Georgia',
      color: textColor,
      bold: true
    });

    slide.addText(step.description, {
      x: sX + 0.18,
      y: titleY + 0.52,
      w: stepW - 0.36,
      h: stepH - (titleY - startY) - 0.65,
      fontSize: 9,
      fontFace: 'Arial',
      color: textMuted,
      lineSpacingMultiple: 1.15
    });
  });

  // Live Deployment Banner
  if (banner) {
    const bannerY = startY + stepH + 0.25;
    const bannerH = 0.85;

    slide.addShape('roundRect', {
      x: startX,
      y: bannerY,
      w: totalWidth,
      h: bannerH,
      rectRadius: 0.08,
      fill: { color: cardFill },
      line: { color: cardBorder, width: 1 }
    });

    // Live Pulse Dot
    slide.addShape('roundRect', {
      x: startX + 0.3,
      y: bannerY + 0.28,
      w: 0.15,
      h: 0.15,
      rectRadius: 0.075,
      fill: { color: '10B981' }
    });

    // Banner Title & Description
    slide.addText(`${banner.title} ${banner.description}`, {
      x: startX + 0.55,
      y: bannerY + 0.18,
      w: totalWidth - 3.2,
      h: 0.48,
      fontSize: 9.5,
      fontFace: 'Arial',
      color: textColor
    });

    // Link
    if (banner.linkUrl) {
      slide.addText(banner.linkText || 'Visit Live Platform', {
        x: startX + totalWidth - 2.5,
        y: bannerY + 0.22,
        w: 2.2,
        h: 0.35,
        fontSize: 9,
        fontFace: 'Arial',
        color: primary,
        bold: true,
        align: 'right'
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Master PPTX Generator: Driven by Canonical Slide Model
// ---------------------------------------------------------------------------

export async function generatePptx(deck: PresentationDeck): Promise<Buffer> {
  const pptx = new (pptxgen as any)();

  // 16:9 Widescreen dimensions: 13.333" width x 7.5" height
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'FocusRealm';
  pptx.company = 'FocusRealm';
  pptx.title = `FocusRealm Presentation - ${deck.companyName}`;

  const startX = 0.85;
  const totalWidth = 11.63; // 0.85 + 11.63 = 12.48" (giving 0.85" right margin)

  for (const rawSlide of deck.slides) {
    // 1. Transform raw slide to canonical model with resolved design tokens
    const canonical: CanonicalSlide = toCanonicalSlide(rawSlide, deck);
    const { header, footer, tokens, layout } = canonical;
    const { palette } = tokens;

    const primaryColor = cleanHex(palette.primary, '102F35');
    const slideBg = cleanHex(palette.background, 'F5F2E9');
    const textColor = cleanHex(palette.text, '102F35');
    const textMutedColor = cleanHex(palette.textMuted, '64748B');

    // 2. Add slide & set background
    const slide = pptx.addSlide();
    slide.background = { color: slideBg };

    // 3. Header: Slide Tag (Top Right)
    if (header.headerTag) {
      slide.addText(header.headerTag, {
        x: 10.4,
        y: 0.45,
        w: 2.1,
        h: 0.35,
        fontSize: 11,
        fontFace: 'Arial',
        color: textMutedColor,
        align: 'right',
        bold: true
      });
    }

    // Header: Eyebrow (Top Left)
    if (header.eyebrow) {
      slide.addText(header.eyebrow.toUpperCase(), {
        x: startX,
        y: 0.45,
        w: 9.2,
        h: 0.3,
        fontSize: 10,
        fontFace: 'Arial',
        color: primaryColor,
        bold: true,
        charSpacing: 2
      });
    }

    // Header: Main Title
    slide.addText(header.title, {
      x: startX,
      y: 0.82,
      w: totalWidth,
      h: 0.72,
      fontSize: 22,
      fontFace: 'Georgia',
      color: textColor,
      bold: true
    });

    // Header: Subtitle
    if (header.subtitle) {
      slide.addText(header.subtitle, {
        x: startX,
        y: 1.56,
        w: totalWidth,
        h: 0.42,
        fontSize: 11.5,
        fontFace: 'Arial',
        color: textMutedColor
      });
    }

    // 4. Layout Dispatch strictly according to canonical type
    switch (layout.type) {
      case 'hero_intro':
        renderPptxHeroIntro(slide, layout.payload, tokens, startX, totalWidth);
        break;

      case 'hero_media_points':
        renderPptxHeroMediaPoints(slide, layout.payload, tokens, startX, totalWidth);
        break;

      case 'card_grid':
        renderPptxCardGrid(slide, layout.payload, tokens, startX, totalWidth);
        break;

      case 'avatar_roster':
        renderPptxAvatarRoster(slide, layout.payload, tokens, startX, totalWidth);
        break;

      case 'stepper_workflow':
        renderPptxStepperWorkflow(slide, layout.payload, tokens, startX, totalWidth);
        break;

      default:
        // Fallback safety to card grid
        renderPptxCardGrid(slide, (layout as any).payload, tokens, startX, totalWidth);
        break;
    }

    // 5. Common Footer: Left Note & Right Watermark
    slide.addText(footer.leftNote || 'FocusRealm Service Execution Platform', {
      x: startX,
      y: 6.85,
      w: 7.5,
      h: 0.35,
      fontSize: 9,
      fontFace: 'Arial',
      color: textMutedColor
    });

    slide.addText(footer.rightNote || 'FocusRealm • Mise Hotel', {
      x: 8.5,
      y: 6.85,
      w: 4.0,
      h: 0.35,
      fontSize: 9,
      fontFace: 'Arial',
      color: textMutedColor,
      align: 'right',
      bold: true
    });
  }

  // 6. Export as Buffer
  const buffer = await pptx.write({ outputType: 'nodebuffer' }) as Buffer;
  return buffer;
}
