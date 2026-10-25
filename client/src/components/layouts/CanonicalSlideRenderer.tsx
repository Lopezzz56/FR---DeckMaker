import React from 'react';
import { CanonicalSlide } from '../../types/canonicalSlide';
import { HeroMediaPointsLayout } from './HeroMediaPointsLayout';
import { CardGridLayout } from './CardGridLayout';
import { AvatarRosterLayout } from './AvatarRosterLayout';
import { StepperWorkflowLayout } from './StepperWorkflowLayout';
import { SLIDE_GEOMETRY } from '../../types/slideGeometry';

interface CanonicalSlideRendererProps {
  slide: CanonicalSlide;
  onOpenSources?: () => void;
  className?: string;
}

/**
 * CanonicalSlideRenderer
 * 
 * Renders EXACTLY into the 1920 x 1080 canonical logical slide canvas.
 * Fixed outer dimensions: 1920px wide by 1080px high.
 * No mode-specific branching, no ad-hoc Tailwind responsive hacks.
 * All viewport scaling is handled uniformly by the enclosing <SlideViewport />.
 */
export const CanonicalSlideRenderer: React.FC<CanonicalSlideRendererProps> = ({
  slide,
  onOpenSources,
  className = ''
}) => {
  const { header, footer, layout, tokens } = slide;
  const { palette } = tokens;

  return (
    <div 
      id={`canonical-slide-${slide.slideNumber}`}
      className={`flex flex-col justify-between relative overflow-hidden select-text box-border ${className}`}
      style={{ 
        width: `${SLIDE_GEOMETRY.CANVAS_WIDTH}px`,
        height: `${SLIDE_GEOMETRY.CANVAS_HEIGHT}px`,
        paddingLeft: `${SLIDE_GEOMETRY.MARGIN_X}px`,
        paddingRight: `${SLIDE_GEOMETRY.MARGIN_X}px`,
        paddingTop: `${SLIDE_GEOMETRY.MARGIN_TOP}px`,
        paddingBottom: `${SLIDE_GEOMETRY.MARGIN_BOTTOM}px`,
        backgroundColor: palette.background, 
        borderColor: palette.border,
        boxSizing: 'border-box'
      }}
    >
      {/* 1. Canonical Slide Header */}
      <div 
        className="flex-shrink-0 flex flex-col justify-start mb-6"
        style={{ minHeight: '130px' }}
      >
        <div className="flex items-center justify-between mb-2.5">
          {header.eyebrow && (
            <span 
              className="font-bold tracking-widest uppercase rounded-md border text-xs px-3 py-1"
              style={{ 
                backgroundColor: `${palette.primary}15`, 
                color: palette.primary, 
                borderColor: `${palette.primary}30` 
              }}
            >
              {header.eyebrow}
            </span>
          )}
          {header.headerTag && (
            <span 
              className="font-mono font-semibold text-sm" 
              style={{ color: palette.textMuted }}
            >
              {header.headerTag}
            </span>
          )}
        </div>

        <h1 
          className="font-serif font-bold tracking-tight leading-[1.15] text-[38px] mb-2 max-w-5xl"
          style={{ color: palette.text }}
        >
          {header.title}
        </h1>
        {header.subtitle && (
          <p 
            className="font-normal text-base max-w-4xl leading-relaxed" 
            style={{ color: palette.textMuted }}
          >
            {header.subtitle}
          </p>
        )}
      </div>

      {/* 2. Layout Slot Dispatch (Exact Content Height: 770px) */}
      <div 
        className="flex-1 flex flex-col justify-center min-h-0 overflow-hidden"
        style={{ height: `${SLIDE_GEOMETRY.CONTENT_HEIGHT}px` }}
      >
        {layout.type === 'hero_media_points' && (
          <HeroMediaPointsLayout payload={layout.payload} tokens={tokens} />
        )}
        {layout.type === 'card_grid' && (
          <CardGridLayout payload={layout.payload} tokens={tokens} onOpenSources={onOpenSources} />
        )}
        {layout.type === 'avatar_roster' && (
          <AvatarRosterLayout payload={layout.payload} tokens={tokens} />
        )}
        {layout.type === 'stepper_workflow' && (
          <StepperWorkflowLayout payload={layout.payload} tokens={tokens} />
        )}
      </div>

      {/* 3. Canonical Slide Footer (Fixed Height: 48px) */}
      <div 
        className="flex items-center justify-between border-t flex-shrink-0 pt-3 text-sm"
        style={{ 
          height: `${SLIDE_GEOMETRY.FOOTER_HEIGHT}px`,
          borderColor: palette.border, 
          color: palette.textMuted 
        }}
      >
        <span className="font-medium">{footer.leftNote || 'FocusRealm Service Execution Platform'}</span>
        <span className="font-semibold" style={{ color: palette.primary }}>
          {footer.rightNote || 'FocusRealm • Mise Hotel'}
        </span>
      </div>
    </div>
  );
};
