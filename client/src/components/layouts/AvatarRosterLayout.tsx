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
    <div className="w-full h-full flex flex-col justify-center items-center py-4">
      <div 
        className={`w-full grid ${
          isTwoCols ? 'grid-cols-2 gap-16 max-w-5xl' : 'grid-cols-3 gap-10 max-w-7xl'
        } items-stretch`}
      >
        {members.map((member) => (
          <div 
            key={member.id}
            className="rounded-2xl shadow-sm border flex flex-col justify-between p-10 relative overflow-hidden text-center items-center transition-all bg-white"
            style={{ 
              backgroundColor: palette.surface, 
              borderColor: palette.border, 
              minHeight: isTwoCols ? '540px' : '520px'
            }}
          >
            {/* Top Accent Stripe */}
            <div 
              className="absolute top-0 left-0 right-0 h-2"
              style={{ backgroundColor: palette.primary }}
            />

            <div className="flex flex-col items-center w-full">
              {member.imageUrl ? (
                <div 
                  className="w-48 h-48 rounded-full overflow-hidden mb-6 border-3 shadow-md bg-slate-100 flex-shrink-0"
                  style={{ borderColor: `${palette.primary}40` }}
                >
                  <img 
                    src={member.imageUrl} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div 
                  className="w-48 h-48 rounded-full mb-6 flex flex-col items-center justify-center border-3 flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: `${palette.primary}08`, borderColor: `${palette.primary}40` }}
                >
                  <span className="text-sm font-semibold" style={{ color: palette.primary }}>
                    {member.role}
                  </span>
                </div>
              )}

              <span 
                className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-md mb-3"
                style={{ backgroundColor: `${palette.accent}18`, color: palette.accent }}
              >
                {member.role}
              </span>

              <h3 
                className="text-3xl font-bold font-serif mb-4 tracking-tight" 
                style={{ color: palette.text }}
              >
                {member.name}
              </h3>

              <p 
                className="text-base leading-relaxed text-center px-4 max-w-md" 
                style={{ color: palette.textMuted }}
              >
                {member.bio}
              </p>
            </div>

            <div 
              className="w-full mt-8 pt-4 border-t text-xs font-bold text-center uppercase tracking-widest"
              style={{ borderColor: `${palette.border}60`, color: palette.primary }}
            >
              FocusRealm Executive
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
