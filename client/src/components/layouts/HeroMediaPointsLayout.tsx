import React from 'react';
import { HeroMediaPointsPayload, DesignTokens } from '../../types/canonicalSlide';

interface Props {
  payload: HeroMediaPointsPayload;
  tokens: DesignTokens;
}

/**
 * HeroMediaPointsLayout
 * Canonical 1920 x 1080 bounds:
 * Content region: 1720px width x 770px height
 * Left column (Media): 720px width
 * Right column (Editorial Pointers): 920px width
 */
export const HeroMediaPointsLayout: React.FC<Props> = ({ payload, tokens }) => {
  const { media, points } = payload;
  const { palette } = tokens;
  const isMobile = media.deviceFrame === 'mobile';

  return (
    <div className="w-full h-full flex items-center justify-between gap-16 py-4">
      {/* Media Mockup Column */}
      <div 
        className="flex flex-col items-center justify-center flex-shrink-0"
        style={{ width: isMobile ? '560px' : '880px', maxHeight: '720px' }}
      >
        {isMobile ? (
          <div className="flex flex-col items-center justify-center w-full">
            {/* Phone device bezel */}
            <div 
              className="rounded-[40px] border-[3px] shadow-2xl bg-white p-3.5 overflow-hidden flex items-center justify-center"
              style={{ 
                borderColor: palette.border,
                width: '340px',
                maxHeight: '620px'
              }}
            >
              {media.imageUrl && (
                <img 
                  src={media.imageUrl} 
                  alt={media.altText || media.caption || 'Product screen'} 
                  className="w-full h-auto max-h-[590px] object-contain rounded-[30px] block"
                />
              )}
            </div>
            {media.caption && (
              <span 
                className="font-medium mt-4 text-center leading-snug text-base"
                style={{ color: palette.textMuted }}
              >
                {media.caption}
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-col justify-center w-full">
            {/* Desktop browser mockup */}
            <div 
              className="w-full rounded-2xl border-2 shadow-2xl bg-white overflow-hidden"
              style={{ borderColor: palette.border, maxHeight: '620px' }}
            >
              {/* Browser chrome header bar */}
              <div className="bg-slate-100/90 px-5 py-3 flex items-center space-x-2 border-b border-slate-200">
                <div className="w-3.5 h-3.5 rounded-full bg-slate-300" />
                <div className="w-3.5 h-3.5 rounded-full bg-slate-300" />
                <div className="w-3.5 h-3.5 rounded-full bg-slate-300" />
                <span className="text-sm text-slate-500 font-mono ml-3">
                  mise.hotel / {media.deviceFrame === 'desktop' ? 'supervision' : 'author'}
                </span>
              </div>
              {media.imageUrl && (
                <img 
                  src={media.imageUrl} 
                  alt={media.altText || media.caption || 'Product dashboard'} 
                  className="w-full h-auto max-h-[550px] object-contain block"
                />
              )}
            </div>
            {media.caption && (
              <span 
                className="font-medium mt-4 text-center leading-snug text-base"
                style={{ color: palette.textMuted }}
              >
                {media.caption}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Editorial Vertical Pointers Column */}
      <div className="flex-1 flex flex-col justify-center space-y-6 pl-4">
        {points.map((p) => (
          <div 
            key={p.id}
            className="border-b last:border-b-0 pb-5"
            style={{ borderColor: `${palette.border}80` }}
          >
            <div className="flex items-center space-x-4 mb-2">
              <span 
                className="w-3.5 h-3.5 rounded-xs flex-shrink-0"
                style={{ backgroundColor: palette.accent }}
              />
              <h3 
                className="font-bold font-serif text-2xl tracking-tight"
                style={{ color: palette.text }}
              >
                {p.title}
              </h3>
            </div>
            <p 
              className="leading-relaxed text-lg pl-7.5"
              style={{ color: palette.textMuted }}
            >
              {p.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
