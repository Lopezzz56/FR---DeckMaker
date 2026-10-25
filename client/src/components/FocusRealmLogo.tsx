import React from 'react';

interface FocusRealmLogoProps {
  size?: number;
  className?: string;
  primaryColor?: string;
  accentColor?: string;
  animated?: boolean;
}

export const FocusRealmLogo: React.FC<FocusRealmLogoProps> = ({
  size = 40,
  className = '',
  primaryColor = '#102F35',
  accentColor = '#3DB89E',
  animated = false,
}) => {
  return (
    <div 
      className={`inline-flex items-center justify-center relative select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full overflow-visible ${animated ? 'animate-logo-float' : ''}`}
      >
        <defs>
          {/* Subtle Outer Glow Filter */}
          <filter id="frSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={accentColor} floodOpacity="0.25" />
          </filter>

          {/* Shimmer gradient for animated loading */}
          <linearGradient id="frFGradient" x1="30" y1="20" x2="75" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="60%" stopColor="#0B2026" />
            <stop offset="100%" stopColor={primaryColor} />
          </linearGradient>

          <linearGradient id="frRGradient" x1="42" y1="46" x2="76" y2="82" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={accentColor} />
            <stop offset="50%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          {/* Ambient border gradient */}
          <linearGradient id="frBorderGradient" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.45" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* 1. Rounded Squircle Background Card */}
        <rect
          x="7"
          y="7"
          width="86"
          height="86"
          rx="25"
          fill="#FFFFFF"
          stroke="url(#frBorderGradient)"
          strokeWidth="2.5"
          filter="url(#frSoftGlow)"
          className={animated ? 'animate-logo-pulse-glow' : ''}
        />

        {/* Inner subtle bevel line */}
        <rect
          x="10.5"
          y="10.5"
          width="79"
          height="79"
          rx="22"
          fill="none"
          stroke={accentColor}
          strokeWidth="0.8"
          strokeOpacity="0.18"
        />

        {/* 2. Monogram Geometry */}
        <g className={animated ? 'animate-logo-letters' : ''}>
          {/* ============================================================== */}
          {/* LETTER 'F' (Deep Brand Spruce / Navy)                           */}
          {/* ============================================================== */}
          
          {/* F - Vertical Main Stem */}
          <rect
            x="34.5"
            y="20.5"
            width="7.5"
            height="58.5"
            fill="url(#frFGradient)"
            rx="0.5"
          />

          {/* F - Top Horizontal Bar with Geometric Downward Triangular Notch */}
          <path
            d="M34.5 20.5H74.5V26.5H62.5L74.5 37.5V26.5H74.5V20.5H34.5Z"
            fill="url(#frFGradient)"
          />
          {/* Top Edge Cap Stripe (Darker architectural accent) */}
          <rect
            x="34.5"
            y="20.5"
            width="40"
            height="2.5"
            fill="#09181C"
            opacity="0.9"
          />
          {/* Downward Angled Wedge at the tip */}
          <path
            d="M62.5 26.5H74.5V37.5L62.5 26.5Z"
            fill="url(#frFGradient)"
          />

          {/* F - Middle Horizontal Crossbar (Passes behind R) */}
          <rect
            x="34.5"
            y="52.5"
            width="27"
            height="5"
            fill="url(#frFGradient)"
            rx="0.5"
          />

          {/* ============================================================== */}
          {/* LETTER 'R' (Mint / Cyan Accent Line & Form)                     */}
          {/* ============================================================== */}
          
          {/* R - Vertical Left Stem (Solid bar) */}
          <rect
            x="43.5"
            y="47"
            width="5.5"
            height="32"
            fill="url(#frRGradient)"
            rx="0.75"
          />

          {/* R - Upper Rounded Loop (Stroked curve with hollow interior) */}
          <path
            d="M48.5 48.5H58.5C67.5 48.5 73.5 53.5 73.5 60.5C73.5 67.5 67 71.5 58 71.5H48.5"
            fill="none"
            stroke="url(#frRGradient)"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animated ? 'animate-logo-dash' : ''}
          />

          {/* R - Sleek Diagonal Leg (Stroked angled path) */}
          <path
            d="M52 70L74.5 80"
            fill="none"
            stroke="url(#frRGradient)"
            strokeWidth="3.6"
            strokeLinecap="round"
            className={animated ? 'animate-logo-dash' : ''}
          />
        </g>
      </svg>
    </div>
  );
};
