import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { PresentationDeck, SlideData } from '../types/presentation.js';
import { toCanonicalSlide } from './canonicalAdapter.js';
import { 
  CanonicalSlide, 
  HeroMediaPointsPayload, 
  CardGridPayload, 
  AvatarRosterPayload, 
  StepperWorkflowPayload 
} from '../types/canonicalSlide.js';

/**
 * Locate Chrome or Edge executable on the system
 */
function getBrowserExecutablePath(): string {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    process.env.CHROME_BIN || ''
  ];

  for (const p of candidates) {
    if (p && fs.existsSync(p)) {
      return p;
    }
  }

  throw new Error('No Chrome or Edge browser executable found on system');
}

/**
 * Robust asset locator looking across server assets, client public, and extracted assets
 */
function resolveAssetPath(imagePath?: string): string | null {
  if (!imagePath) return null;
  const fileName = path.basename(imagePath);
  const possibleDirs = [
    path.resolve(process.cwd(), 'assets'),
    path.resolve(process.cwd(), 'server/assets'),
    path.resolve(process.cwd(), '../client/public/assets'),
    path.resolve(process.cwd(), 'client/public/assets'),
    path.resolve(process.cwd(), 'extracted_assets'),
    path.resolve(process.cwd(), '../extracted_assets')
  ];

  for (const dir of possibleDirs) {
    const fullPath = path.join(dir, fileName);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  return null;
}

/**
 * Convert local image file to base64 data URI for instant, reliable rendering in headless Chromium
 */
function getAssetDataUri(imagePath?: string): string | null {
  const fullPath = resolveAssetPath(imagePath);
  if (!fullPath) return null;
  try {
    const ext = path.extname(fullPath).toLowerCase();
    const mime = ext === '.png' ? 'image/png' : ext === '.svg' ? 'image/svg+xml' : 'image/jpeg';
    const base64 = fs.readFileSync(fullPath).toString('base64');
    return `data:${mime};base64,${base64}`;
  } catch (err) {
    console.error('Failed to encode image to base64:', fullPath, err);
    return null;
  }
}

/**
 * Layout Renderers driven strictly by Canonical Schema
 */
function renderHeroMediaPoints(payload: HeroMediaPointsPayload, tokens: CanonicalSlide['tokens']): string {
  const { media, points } = payload;
  const { palette } = tokens;
  const isMobile = media.deviceFrame === 'mobile';
  const dataUri = getAssetDataUri(media.imageUrl) || media.imageUrl;

  return `
    <div style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 48px; align-items: center; width: 100%;">
      <!-- Left Column: Device Mockup -->
      <div style="grid-column: span ${isMobile ? 5 : 7}; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        ${isMobile ? `
          <div style="max-width: 260px; width: 100%; border-radius: 24px; border: 2.5px solid ${palette.border}; background: #ffffff; padding: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); overflow: hidden; display: flex; align-items: center; justify-content: center;">
            ${dataUri ? `<img src="${dataUri}" alt="${media.caption || ''}" style="max-height: 400px; width: auto; height: auto; object-fit: contain; border-radius: 18px; display: block;" />` : ''}
          </div>
          ${media.caption ? `<div style="font-size: 14px; color: ${palette.textMuted}; margin-top: 12px; font-weight: 500; text-align: center;">${media.caption}</div>` : ''}
        ` : `
          <div style="width: 100%; border-radius: 18px; border: 1.5px solid ${palette.border}; background: #ffffff; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06);">
            <div style="background: #f8fafc; padding: 10px 18px; display: flex; align-items: center; border-bottom: 1px solid #e2e8f0;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; margin-right: 6px;"></span>
              <span style="width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; margin-right: 6px;"></span>
              <span style="width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; margin-right: 14px;"></span>
              <span style="font-size: 12px; font-family: monospace; color: #64748b;">mise.hotel / ${media.deviceFrame === 'desktop' ? 'supervision' : 'author'}</span>
            </div>
            ${dataUri ? `<img src="${dataUri}" alt="${media.caption || ''}" style="width: 100%; max-height: 420px; object-fit: contain; display: block;" />` : ''}
          </div>
          ${media.caption ? `<div style="font-size: 14px; color: ${palette.textMuted}; margin-top: 12px; font-weight: 500; text-align: center;">${media.caption}</div>` : ''}
        `}
      </div>

      <!-- Right Column: Editorial Points -->
      <div style="grid-column: span ${isMobile ? 7 : 5}; display: flex; flex-direction: column; gap: 20px;">
        ${points.map(p => `
          <div style="padding-bottom: 14px; border-bottom: 1px solid ${palette.border}80;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span style="width: 10px; height: 10px; background: ${palette.accent}; border-radius: 2px; flex-shrink: 0;"></span>
              <h3 style="font-family: Georgia, serif; font-size: 20px; font-weight: 700; color: ${palette.text}; margin: 0;">${p.title}</h3>
            </div>
            <p style="font-size: 14px; line-height: 1.5; color: ${palette.textMuted}; margin: 0; padding-left: 20px;">${p.description}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderCardGrid(payload: CardGridPayload, tokens: CanonicalSlide['tokens']): string {
  const { cards, columns, bannerCallout } = payload;
  const { palette } = tokens;
  const colCount = columns === 6 ? 3 : columns;

  return `
    <div style="width: 100%; display: flex; flex-direction: column; gap: 20px;">
      <div style="display: grid; grid-template-columns: repeat(${colCount}, 1fr); gap: 24px; width: 100%;">
        ${cards.map(card => {
          const isFact = card.badge?.includes('FACT');
          return `
            <div style="background: ${palette.surface}; border: 1.5px solid ${palette.border}; border-radius: 16px; padding: 24px; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 14px rgba(0,0,0,0.03);">
              <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: ${palette.primary};"></div>
              <div>
                ${card.highlight && card.number ? `
                  <div style="width: 36px; height: 36px; border-radius: 50%; background: ${palette.primary}; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; margin-bottom: 14px;">${card.number}</div>
                ` : card.badge ? `
                  <span style="display: inline-block; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; background: ${isFact ? '#16a34a18' : `${palette.accent}20`}; color: ${isFact ? '#16a34a' : palette.accent}; padding: 4px 10px; border-radius: 6px; margin-bottom: 12px;">${card.badge}</span>
                ` : card.number ? `
                  <span style="display: block; font-family: monospace; font-size: 14px; font-weight: 700; color: ${palette.primary}; margin-bottom: 10px;">${card.number}</span>
                ` : ''}

                <h3 style="font-family: Georgia, serif; font-size: 20px; font-weight: 700; color: ${palette.text}; margin: 0 0 10px; line-height: 1.3;">${card.title}</h3>
                <p style="font-size: 14px; line-height: 1.55; color: ${palette.textMuted}; margin: 0;">${card.description}</p>
              </div>

              ${card.highlight ? '' : `
                <div style="margin-top: 18px; padding-top: 12px; border-top: 1px solid ${palette.border}80; display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: ${palette.primary};">
                  <span>Verified standard</span>
                </div>
              `}
            </div>
          `;
        }).join('')}
      </div>

      ${bannerCallout ? `
        <div style="background: ${palette.primary}; border-radius: 14px; padding: 18px; text-align: center; color: #ffffff; font-size: 15px; font-weight: 600; box-shadow: 0 4px 14px rgba(0,0,0,0.06);">
          ${bannerCallout.text}
        </div>
      ` : ''}
    </div>
  `;
}

function renderAvatarRoster(payload: AvatarRosterPayload, tokens: CanonicalSlide['tokens']): string {
  const { members } = payload;
  const { palette } = tokens;
  const colCount = members.length === 2 ? 2 : 3;

  return `
    <div style="display: grid; grid-template-columns: repeat(${colCount}, 1fr); gap: 32px; width: 100%; max-width: ${colCount === 2 ? '1200px' : '100%'}; margin: 0 auto;">
      ${members.map(m => {
        const dataUri = getAssetDataUri(m.imageUrl) || m.imageUrl;
        return `
          <div style="background: ${palette.surface}; border: 1.5px solid ${palette.border}; border-radius: 18px; padding: 32px 24px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: space-between; position: relative; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.03);">
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: ${palette.primary};"></div>
            <div style="display: flex; flex-direction: column; align-items: center;">
              ${dataUri ? `
                <div style="width: 140px; height: 140px; border-radius: 50%; overflow: hidden; margin-bottom: 16px; border: 3px solid ${palette.primary}40; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                  <img src="${dataUri}" alt="${m.name}" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
              ` : `
                <div style="width: 140px; height: 140px; border-radius: 50%; background: ${palette.primary}10; border: 3px solid ${palette.primary}40; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                  <span style="font-weight: 700; color: ${palette.primary}; font-size: 16px;">${m.role}</span>
                </div>
              `}
              <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; background: ${palette.accent}20; color: ${palette.accent}; padding: 4px 10px; border-radius: 6px; margin-bottom: 8px;">${m.role}</span>
              <h3 style="font-family: Georgia, serif; font-size: 22px; font-weight: 700; color: ${palette.text}; margin: 0 0 6px;">${m.name}</h3>
            </div>
            <p style="font-size: 14px; line-height: 1.55; color: ${palette.textMuted}; margin: 12px 0 0;">${m.bio}</p>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderStepperWorkflow(payload: StepperWorkflowPayload, tokens: CanonicalSlide['tokens']): string {
  const { steps, banner } = payload;
  const { palette } = tokens;

  return `
    <div style="width: 100%; display: flex; flex-direction: column; gap: 20px;">
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; width: 100%;">
        ${steps.map(s => `
          <div style="background: ${palette.surface}; border: 1.5px solid ${palette.border}; border-radius: 16px; padding: 22px; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 14px rgba(0,0,0,0.03);">
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: ${palette.primary};"></div>
            <div>
              <span style="display: inline-block; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; background: ${palette.accent}20; color: ${palette.accent}; padding: 4px 10px; border-radius: 6px; margin-bottom: 14px;">Step ${s.stepNumber}</span>
              <h3 style="font-family: Georgia, serif; font-size: 19px; font-weight: 700; color: ${palette.text}; margin: 0 0 10px;">${s.title}</h3>
              <p style="font-size: 13.5px; line-height: 1.5; color: ${palette.textMuted}; margin: 0;">${s.description}</p>
            </div>
            <div style="margin-top: 18px; padding-top: 10px; border-top: 1px solid ${palette.border}80; font-size: 12.5px; font-weight: 600; color: ${palette.primary};">
              Verified standard
            </div>
          </div>
        `).join('')}
      </div>

      ${banner ? `
        <div style="background: ${palette.primary}10; border: 1.5px solid ${palette.primary}30; border-radius: 14px; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: #10b981;"></span>
            <span style="font-weight: 700; font-size: 14px; color: ${palette.primary};">${banner.title}</span>
            <span style="font-size: 14px; color: ${palette.textMuted};">${banner.description}</span>
          </div>
          ${banner.linkUrl ? `
            <a href="${banner.linkUrl}" style="background: ${palette.primary}; color: #ffffff; padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none;">${banner.linkText || 'Open link'}</a>
          ` : ''}
        </div>
      ` : ''}
    </div>
  `;
}

function renderHeroIntro(payload: any, tokens: CanonicalSlide['tokens']): string {
  const { pillars, tagline } = payload;
  const { palette } = tokens;

  return `
    <div style="width: 100%; display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 24px 0;">
      <div style="max-width: 1000px; padding-top: 16px;">
        <div style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 9999px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; background: ${palette.accent}20; color: ${palette.primary}; border: 1.5px solid ${palette.accent}40; margin-bottom: 24px;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></span>
          <span>Operational Integrity & Verified Service</span>
        </div>
        <p style="font-family: Georgia, serif; font-size: 24px; line-height: 1.6; color: ${palette.text}; margin: 0;">
          ${tagline || "Built alongside luxury hoteliers to bridge the gap between executive standards and daily floor execution — ensuring accountability, tamper-proof proof, and pristine guest experiences across every shift."}
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 48px; padding-top: 32px; border-top: 1.5px solid ${palette.border}80;">
        ${pillars.map((p: any, idx: number) => `
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
              <span style="font-family: monospace; font-size: 14px; font-weight: 700; padding: 2px 8px; border-radius: 4px; background: ${palette.primary}18; color: ${palette.primary};">0${idx + 1}</span>
              <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: ${palette.accent};">${p.badge || 'Core Value'}</span>
            </div>
            <h3 style="font-family: Georgia, serif; font-size: 22px; font-weight: 700; color: ${palette.text}; margin: 0 0 10px;">${p.title}</h3>
            <p style="font-size: 15px; line-height: 1.6; color: ${palette.textMuted}; margin: 0;">${p.description}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Render single slide HTML using Canonical Adapter
 */
function renderCanonicalSlideHtml(slide: SlideData, deck: PresentationDeck): string {
  const canonical = toCanonicalSlide(slide, deck);
  const { header, footer, layout, tokens } = canonical;
  const { palette } = tokens;

  let bodyContent = '';
  switch (layout.type) {
    case 'hero_intro':
      bodyContent = renderHeroIntro(layout.payload, tokens);
      break;
    case 'hero_media_points':
      bodyContent = renderHeroMediaPoints(layout.payload, tokens);
      break;
    case 'card_grid':
      bodyContent = renderCardGrid(layout.payload, tokens);
      break;
    case 'avatar_roster':
      bodyContent = renderAvatarRoster(layout.payload, tokens);
      break;
    case 'stepper_workflow':
      bodyContent = renderStepperWorkflow(layout.payload, tokens);
      break;
  }

  return `
    <div class="slide-page" style="width: 1920px; height: 1080px; page-break-after: always; break-after: page; background: ${palette.background}; box-sizing: border-box; padding: 60px 80px; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; position: relative;">
      <!-- Canonical Slide Header -->
      <div style="margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="font-size: 13px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; background: ${palette.primary}15; color: ${palette.primary}; border: 1px solid ${palette.primary}35; padding: 5px 14px; border-radius: 6px;">
            ${header.eyebrow}
          </span>
          <span style="font-family: monospace; font-size: 15px; font-weight: 600; color: ${palette.textMuted};">
            ${header.headerTag}
          </span>
        </div>
        <h1 style="font-family: Georgia, serif; font-size: 42px; font-weight: 700; color: ${palette.text}; margin: 0 0 10px; line-height: 1.2; letter-spacing: -0.5px;">
          ${header.title}
        </h1>
        ${header.subtitle ? `
          <p style="font-size: 18px; color: ${palette.textMuted}; margin: 0; line-height: 1.5; max-width: 1200px;">
            ${header.subtitle}
          </p>
        ` : ''}
      </div>

      <!-- Layout Content Body -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; min-height: 0;">
        ${bodyContent}
      </div>

      <!-- Canonical Slide Footer -->
      <div style="border-top: 1.5px solid ${palette.border}; padding-top: 20px; display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: ${palette.textMuted};">
        <span>${footer.leftNote}</span>
        <span style="font-weight: 700; color: ${palette.primary};">${footer.rightNote}</span>
      </div>
    </div>
  `;
}

function buildFullDocumentHtml(deck: PresentationDeck): string {
  const slidesHtml = deck.slides.map(slide => renderCanonicalSlideHtml(slide, deck)).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${deck.companyName} Presentation</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    @page {
      size: 1920px 1080px;
      margin: 0;
    }
    
    * {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    html, body {
      margin: 0;
      padding: 0;
      width: 1920px;
      background: #f1f5f9;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    
    .slide-page {
      page-break-inside: avoid;
      break-inside: avoid;
    }
  </style>
</head>
<body>
  ${slidesHtml}
</body>
</html>`;
}

/**
 * Export high-fidelity vector PDF using Headless Chromium
 */
export async function generatePdf(deck: PresentationDeck): Promise<Buffer> {
  const chromePath = getBrowserExecutablePath();
  const html = buildFullDocumentHtml(deck);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=none'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2
    });

    await page.setContent(html, {
      waitUntil: 'load',
      timeout: 30000
    });

    await new Promise(r => setTimeout(r, 600));

    const pdfBuffer = await page.pdf({
      width: '1920px',
      height: '1080px',
      printBackground: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      },
      preferCSSPageSize: true
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
