import React from 'react';
import { AvatarRosterPayload, DesignTokens } from '../../types/canonicalSlide';

interface Props {
  payload: AvatarRosterPayload;
  tokens: DesignTokens;
}

/**
 * AvatarRosterLayout
 * Canonical 1920 x 1080 bounds:
 * Content region: 1720px width x 770px height
 * 2 or 3 executive portrait cards
 */
export const AvatarRosterLayout: React.FC<Props> = ({ payload, tokens }) => {
  const { members } = payload;
  const { palette } = tokens;
  const isTwoCols = members.length === 2;

  return (
    <div className={`w-full h-full flex items-center justify-center ${
      isTwoCols ? 'max-w-4xl mx-auto' : 'max-w-6xl mx-auto'
    } py-2`}>
      <div className={`w-full grid ${isTwoCols ? 'grid-cols-2 gap-10' : 'grid-cols-3 gap-8'} items-stretch`}>
        {members.map((member) => (
          <div 
            key={member.id}
            className="rounded-2xl shadow-sm border flex flex-col justify-between p-8 relative overflow-hidden text-center items-center transition-all bg-white"
            style={{ backgroundColor: palette.surface, borderColor: palette.border, minHeight: '440px' }}
          >
            {/* Top Accent Stripe */}
            <div 
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: palette.primary }}
            />

            <div className="flex flex-col items-center w-full">
              {member.imageUrl ? (
                <div 
                  className="w-36 h-36 rounded-full overflow-hidden mb-5 border-2 shadow-sm bg-slate-100 flex-shrink-0"
                  style={{ borderColor: `${palette.primary}35` }}
                >
                  <img 
                    src={member.imageUrl} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div 
                  className="w-36 h-36 rounded-full mb-5 flex flex-col items-center justify-center border-2 flex-shrink-0"
                  style={{ backgroundColor: `${palette.primary}08`, borderColor: `${palette.primary}35` }}
                >
                  <span className="text-xs font-semibold" style={{ color: palette.primary }}>
                    {member.role}
                  </span>
                </div>
              )}

              <span 
                className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded mb-2.5"
                style={{ backgroundColor: `${palette.accent}18`, color: palette.accent }}
              >
                {member.role}
              </span>

              <h3 
                className="text-2xl font-bold font-serif mb-3 tracking-tight" 
                style={{ color: palette.text }}
              >
                {member.name}
              </h3>

              <p 
                className="text-sm leading-relaxed text-center px-2" 
                style={{ color: palette.textMuted }}
              >
                {member.bio}
              </p>
            </div>

            <div 
              className="w-full mt-6 pt-3 border-t text-[11px] font-semibold text-center uppercase tracking-wider"
              style={{ borderColor: `${palette.border}50`, color: palette.primary }}
            >
              FocusRealm Executive
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
