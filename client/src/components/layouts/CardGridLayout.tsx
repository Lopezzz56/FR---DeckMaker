import React from 'react';
import { CardGridPayload, DesignTokens } from '../../types/canonicalSlide';
import { ShieldCheck, ExternalLink } from 'lucide-react';

interface Props {
  payload: CardGridPayload;
  tokens: DesignTokens;
  onOpenSources?: () => void;
}

/**
 * CardGridLayout
 * Canonical 1920 x 1080 bounds:
 * Content region: 1720px width x 770px height
 * Supports 2, 3, 4, or 6 cards in grid
 */
export const CardGridLayout: React.FC<Props> = ({ payload, tokens, onOpenSources }) => {
  const { cards, columns, bannerCallout } = payload;
  const { palette } = tokens;

  // Determine grid template
  let gridColsClass = 'grid-cols-3';
  if (columns === 2) gridColsClass = 'grid-cols-2 max-w-5xl mx-auto';
  if (columns === 4) gridColsClass = 'grid-cols-4';
  if (columns === 6) gridColsClass = 'grid-cols-3';

  return (
    <div className="w-full h-full flex flex-col justify-center items-center py-2 gap-8">
      <div className={`grid ${gridColsClass} gap-7 w-full items-stretch`}>
        {cards.map((card) => {
          const isFact = card.badge?.includes('FACT');

          return (
            <div 
              key={card.id}
              className="rounded-2xl shadow-sm border flex flex-col justify-between p-8 relative overflow-hidden transition-all bg-white"
              style={{ backgroundColor: palette.surface, borderColor: palette.border, minHeight: '340px', maxHeight: '460px' }}
            >
              {/* Top Accent Stripe */}
              <div 
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: palette.primary }}
              />

              <div>
                {/* Number Badge or Pill Badge */}
                {card.highlight && card.number ? (
                  <div 
                    className="w-11 h-11 rounded-full text-white flex items-center justify-center font-bold text-lg mb-4 shadow-xs"
                    style={{ backgroundColor: palette.primary }}
                  >
                    {card.number}
                  </div>
                ) : card.badge ? (
                  <span 
                    className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded inline-block mb-3"
                    style={{ 
                      backgroundColor: isFact ? '#16a34a18' : `${palette.accent}18`, 
                      color: isFact ? '#16a34a' : palette.accent 
                    }}
                  >
                    {card.badge}
                  </span>
                ) : card.number ? (
                  <span 
                    className="text-sm font-mono font-bold block mb-3"
                    style={{ color: palette.primary }}
                  >
                    {card.number}
                  </span>
                ) : null}

                <h3 
                  className="text-2xl font-bold font-serif mb-3 leading-snug tracking-tight" 
                  style={{ color: palette.text }}
                >
                  {card.title}
                </h3>
                <p 
                  className="text-base leading-relaxed" 
                  style={{ color: palette.textMuted }}
                >
                  {card.description}
                </p>
              </div>

              {/* Card Footer: Citation or Verified Badge */}
              {card.sourceUrl ? (
                <div 
                  className="mt-6 pt-4 border-t flex items-center justify-between text-sm font-medium" 
                  style={{ borderColor: `${palette.border}60` }}
                >
                  <button
                    onClick={onOpenSources}
                    className="inline-flex items-center space-x-1.5 font-semibold text-emerald-600 hover:underline cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Citation</span>
                  </button>
                </div>
              ) : card.highlight ? null : (
                <div 
                  className="mt-6 pt-4 border-t flex items-center space-x-2 text-sm font-semibold"
                  style={{ borderColor: `${palette.border}60`, color: palette.primary }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified standard</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Optional Reassurance Callout Banner (Slide 11 style) */}
      {bannerCallout && (
        <div 
          className="w-full rounded-2xl border flex items-center justify-center text-center p-5 shadow-xs flex-shrink-0"
          style={{ backgroundColor: palette.primary, borderColor: palette.primary }}
        >
          <span className="text-base font-semibold text-white tracking-wide">
            {bannerCallout.text}
          </span>
        </div>
      )}
    </div>
  );
};
