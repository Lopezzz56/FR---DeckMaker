import React, { useMemo } from 'react';
import { PresentationDeck, SlideData } from '../types/presentation';
import { toCanonicalSlide } from '../utils/canonicalAdapter';
import { CanonicalSlideRenderer } from './layouts/CanonicalSlideRenderer';
import { SlideViewport } from './SlideViewport';
import { 
  Sparkles, 
  Edit3, 
  ChevronLeft, 
  ChevronRight, 
  Layout 
} from 'lucide-react';

interface SlideViewerProps {
  deck: PresentationDeck;
  slide: SlideData;
  activeSlideIndex: number;
  totalSlides: number;
  onPrevSlide?: () => void;
  onNextSlide?: () => void;
  onEditSlide?: () => void;
  onRegenerateSlide?: () => void;
  onOpenSources?: () => void;
  onUpdateLayout?: (layoutType: SlideData['layoutType']) => void;
  isPresentationMode?: boolean;
  isFullscreen?: boolean;
}

const LAYOUT_OPTIONS: Array<{ value: SlideData['layoutType']; label: string }> = [
  { value: 'intro_title', label: '3-Card Grid' },
  { value: 'company_overview', label: '4-Card Overview' },
  { value: 'grid_six', label: '6-Card Grid' },
  { value: 'fit_columns', label: '3-Card + Banner' },
  { value: 'pilot_steps', label: 'Proposal Steps' },
  { value: 'staff_experience', label: 'Hero Mobile Floor' },
  { value: 'manager_experience', label: 'Hero Desktop Supervision' },
  { value: 'author_experience', label: 'Hero Author Portal' },
  { value: 'team_portraits', label: 'Executive Leadership' },
  { value: 'advisors_list', label: 'Advisory Roster' },
  { value: 'workflow_overview', label: 'Stepper Workflow' },
];

export const SlideViewer: React.FC<SlideViewerProps> = ({
  deck,
  slide,
  activeSlideIndex,
  totalSlides,
  onPrevSlide,
  onNextSlide,
  onEditSlide,
  onRegenerateSlide,
  onOpenSources,
  onUpdateLayout,
  isPresentationMode = false,
  isFullscreen = false,
}) => {
  // Convert current slide into the canonical model
  const canonical = useMemo(() => {
    return toCanonicalSlide(slide, deck);
  }, [slide, deck]);

  const primaryColor = canonical.tokens.palette.primary;

  return (
    <div className={
      isFullscreen
        ? "w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-black select-none p-0 m-0"
        : isPresentationMode 
          ? "w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden" 
          : "flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-100/70 p-6 overflow-hidden"
    }>
      {/* Slide Canvas Toolbar (Studio mode only) */}
      {!isPresentationMode && (
        <div className="flex items-center justify-between mb-3 max-w-5xl mx-auto w-full no-print flex-shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={onPrevSlide}
              disabled={activeSlideIndex === 0}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-30 disabled:hover:bg-white transition-colors cursor-pointer"
              title="Previous Slide (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-600 px-2 font-mono">
              Slide {activeSlideIndex + 1} of {totalSlides}
            </span>
            <button
              onClick={onNextSlide}
              disabled={activeSlideIndex === totalSlides - 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-30 disabled:hover:bg-white transition-colors cursor-pointer"
              title="Next Slide (Right Arrow)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Quick Layout Archetype Switcher */}
            {onUpdateLayout && (
              <div className="hidden sm:flex items-center space-x-1.5 pl-3 border-l border-slate-200">
                <Layout className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={slide.layoutType}
                  onChange={(e) => onUpdateLayout(e.target.value as any)}
                  className="text-xs font-medium bg-white border border-slate-200 text-slate-700 rounded-lg px-2 py-1 focus:ring-1 focus:ring-[#102F35] cursor-pointer"
                  title="Switch Slide Layout Archetype"
                >
                  {LAYOUT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onEditSlide}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Slide</span>
            </button>

            <button
              onClick={onRegenerateSlide}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-2xs border cursor-pointer"
              style={{ 
                backgroundColor: `${primaryColor}12`, 
                color: primaryColor, 
                borderColor: `${primaryColor}30` 
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span>Regenerate this Slide</span>
            </button>
          </div>
        </div>
      )}

      {/* Uniform Slide Viewport: Centers and uniformly scales the 1920x1080 canvas */}
      <div className="flex-1 w-full h-full flex items-center justify-center min-h-0 relative">
        <SlideViewport 
          className="w-full h-full"
          maxScale={isFullscreen ? 1.0 : 0.95}
        >
          <div className="rounded-2xl shadow-2xl overflow-hidden border border-black/10">
            <CanonicalSlideRenderer
              slide={canonical}
              onOpenSources={onOpenSources}
            />
          </div>
        </SlideViewport>
      </div>
    </div>
  );
};
