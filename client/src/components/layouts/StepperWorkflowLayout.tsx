import React from 'react';
import { StepperWorkflowPayload, DesignTokens } from '../../types/canonicalSlide';
import { ArrowRight, ExternalLink } from 'lucide-react';

interface Props {
  payload: StepperWorkflowPayload;
  tokens: DesignTokens;
}

/**
 * StepperWorkflowLayout
 * Canonical 1920 x 1080 bounds:
 * Content region: 1720px width x 770px height
 * 4 Step cards: 400px width each, 440px height
 * Live deployment banner: 1720px width, 72px height
 */
export const StepperWorkflowLayout: React.FC<Props> = ({ payload, tokens }) => {
  const { steps, banner } = payload;
  const { palette } = tokens;

  return (
    <div className="w-full h-full flex flex-col justify-center py-2 gap-8">
      {/* 4-Step Cards Grid */}
      <div className="grid grid-cols-4 gap-7 w-full items-stretch">
        {steps.map((step, idx) => (
          <div 
            key={idx}
            className="rounded-2xl shadow-sm border flex flex-col justify-between p-8 relative overflow-hidden transition-all bg-white"
            style={{ backgroundColor: palette.surface, borderColor: palette.border, minHeight: '360px', maxHeight: '460px' }}
          >
            {/* Top Accent Stripe */}
            <div 
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: palette.primary }}
            />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span 
                  className="font-bold uppercase tracking-wider text-xs px-3 py-1 rounded"
                  style={{ backgroundColor: `${palette.accent}18`, color: palette.accent }}
                >
                  Step {step.stepNumber}
                </span>
              </div>
              <h3 
                className="font-bold font-serif text-2xl mb-3 tracking-tight leading-snug" 
                style={{ color: palette.text }}
              >
                {step.title}
              </h3>
              <p 
                className="leading-relaxed text-base" 
                style={{ color: palette.textMuted }}
              >
                {step.description}
              </p>
            </div>

            <div 
              className="mt-6 pt-4 border-t flex items-center justify-between text-sm font-semibold" 
              style={{ borderColor: `${palette.border}60`, color: palette.primary }}
            >
              <span>Verified standard</span>
              {idx < steps.length - 1 && (
                <ArrowRight className="w-4 h-4 opacity-70" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Optional Live Platform Banner */}
      {banner && (
        <div 
          className="rounded-2xl border flex items-center justify-between px-6 py-4 mt-6 shadow-xs flex-shrink-0"
          style={{ backgroundColor: `${palette.primary}0a`, borderColor: `${palette.primary}25` }}
        >
          <div className="flex items-center space-x-3.5">
            {banner.statusDot && (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            )}
            <span className="text-base font-bold" style={{ color: palette.primary }}>
              {banner.title}
            </span>
            <span className="text-base" style={{ color: palette.textMuted }}>
              {banner.description}
            </span>
          </div>

          {banner.linkUrl && (
            <a 
              href={banner.linkUrl} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center space-x-2 text-sm font-semibold px-4 py-2 rounded-lg border transition-all hover:opacity-90"
              style={{ backgroundColor: palette.primary, color: '#ffffff', borderColor: palette.primary }}
            >
              <span>{banner.linkText || 'Open link'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};
