import React from 'react';
import { HeroIntroPayload, DesignTokens } from '../../types/canonicalSlide';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  payload: HeroIntroPayload;
  tokens: DesignTokens;
}

/**
 * HeroIntroLayout
 * Elegant executive introduction / cover hero presentation.
 * Features:
 * - Headline banner & executive narrative
 * - Three subtle horizontal or minimal vertical value pillars (not heavy cards)
 * - Brand accent flourishes
 */
export const HeroIntroLayout: React.FC<Props> = ({ payload, tokens }) => {
  const { pillars, tagline } = payload;
  const { palette } = tokens;

  return (
    <div className="w-full h-full flex flex-col justify-between py-6 px-2">
      {/* Upper Executive Callout & Value Narrative */}
      <div className="max-w-4xl pt-4">
        <div 
          className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 border"
          style={{ 
            backgroundColor: `${palette.accent}15`, 
            borderColor: `${palette.accent}35`,
            color: palette.primary 
          }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Operational Integrity & Verified Service</span>
        </div>

        <p 
          className="text-2xl font-serif leading-relaxed text-slate-800"
          style={{ color: palette.text }}
        >
          {tagline || "Built alongside luxury hoteliers to bridge the gap between executive standards and daily floor execution — ensuring accountability, tamper-proof proof, and pristine guest experiences across every shift."}
        </p>
      </div>

      {/* 3 Subtle Horizontal Value Pillars (Refined minimal layout, not heavy cards) */}
      <div 
        className="w-full flex flex-row items-start justify-between pt-8 border-t"
        style={{ 
          display: 'flex',
          flexDirection: 'row',
          gap: '48px',
          width: '100%',
          borderColor: `${palette.border}80` 
        }}
      >
        {pillars.map((pillar, idx) => (
          <div 
            key={idx} 
            className="flex flex-col justify-between"
            style={{ flex: '1 1 0%', minWidth: 0 }}
          >
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <span 
                  className="font-mono text-sm font-bold px-2 py-0.5 rounded"
                  style={{ backgroundColor: `${palette.primary}12`, color: palette.primary }}
                >
                  0{idx + 1}
                </span>
                <span 
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: palette.accent }}
                >
                  {pillar.badge || 'Core Value'}
                </span>
              </div>

              <h3 
                className="font-serif font-bold text-2xl mb-2.5 tracking-tight"
                style={{ color: palette.text }}
              >
                {pillar.title}
              </h3>

              <p 
                className="text-base leading-relaxed"
                style={{ color: palette.textMuted }}
              >
                {pillar.description}
              </p>
            </div>

            <div 
              className="mt-6 flex items-center space-x-2 text-xs font-semibold"
              style={{ color: palette.primary }}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verified FocusRealm Standard</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
