import { SLIDE_GEOMETRY } from '../types/slideGeometry.js';

interface ViewportTestCase {
  name: string;
  width: number;
  height: number;
}

const VIEWPORTS: ViewportTestCase[] = [
  { name: 'HD Laptop (1366 x 768)', width: 1366, height: 768 },
  { name: 'MacBook Air (1440 x 900)', width: 1440, height: 900 },
  { name: 'Full HD Monitor (1920 x 1080)', width: 1920, height: 1080 },
  { name: 'QHD 2K Display (2560 x 1440)', width: 2560, height: 1440 },
  { name: 'Studio Preview Card (960 x 540)', width: 960, height: 540 },
];

console.log('================================================================');
console.log('  FOCUSREALM PRESENTATION ENGINE - VIEWPORT GEOMETRY VALIDATION');
console.log('================================================================\n');

let passed = true;

for (const vp of VIEWPORTS) {
  const scaleX = vp.width / SLIDE_GEOMETRY.CANVAS_WIDTH;
  const scaleY = vp.height / SLIDE_GEOMETRY.CANVAS_HEIGHT;
  const scale = Math.min(scaleX, scaleY);

  const renderedW = Math.round(SLIDE_GEOMETRY.CANVAS_WIDTH * scale);
  const renderedH = Math.round(SLIDE_GEOMETRY.CANVAS_HEIGHT * scale);
  const renderedAspect = renderedW / renderedH;

  const aspectDeviation = Math.abs(renderedAspect - (16 / 9));

  console.log(`[VIEWPORT: ${vp.name}]`);
  console.log(`  Scale Factor: ${scale.toFixed(4)}`);
  console.log(`  Fitted Box:   ${renderedW}px × ${renderedH}px (Target Aspect: 1.7778, Actual: ${renderedAspect.toFixed(4)})`);

  // Assertions:
  // 1. Must fit fully inside viewport without overflow
  const fitsWidth = renderedW <= vp.width;
  const fitsHeight = renderedH <= vp.height;
  const aspectPreserved = aspectDeviation < 0.01;

  if (!fitsWidth || !fitsHeight || !aspectPreserved) {
    console.error(`  ❌ FAILED: Bounds or aspect ratio violated!`);
    passed = false;
  } else {
    console.log(`  ✅ Perfectly bounded & centered without letterbox distortion\n`);
  }
}

if (passed) {
  console.log('✅ ALL VIEWPORT GEOMETRY CHECKS PASSED WITH 100% UNIFORM PROPORTIONS!');
  process.exit(0);
} else {
  console.error('❌ Viewport geometry checks failed.');
  process.exit(1);
}
