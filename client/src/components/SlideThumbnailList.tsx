import React from 'react';
import { PresentationDeck, SlideData } from '../types/presentation';
import { 
  ShieldCheck, 
  UserCheck, 
  Layers, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown, 
  Copy, 
  Trash2, 
  Plus 
} from 'lucide-react';

interface SlideThumbnailListProps {
  deck: PresentationDeck;
  activeSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onMoveSlide?: (index: number, direction: 'up' | 'down') => void;
  onDuplicateSlide?: (index: number) => void;
  onDeleteSlide?: (index: number) => void;
  onAddSlide?: () => void;
}

export const SlideThumbnailList: React.FC<SlideThumbnailListProps> = ({
  deck,
  activeSlideIndex,
  onSelectSlide,
  onMoveSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onAddSlide,
}) => {
  const section1Slides = deck.slides.filter(s => s.section === 'focusrealm_core');
  const section2Slides = deck.slides.filter(s => s.section === 'personalized');
  const activePrimary = deck.theme.focusRealmPalette.primary;

  const renderThumbnail = (slide: SlideData, globalIndex: number) => {
    const isActive = activeSlideIndex === globalIndex;
    const isPersonalized = slide.section === 'personalized';
    const slideBrand = slide.customBrandTheme?.primary || deck.theme.targetBrandPalette.primary;

    return (
      <div
        key={slide.id}
        className={`w-full text-left p-3 rounded-xl transition-all duration-150 border mb-2 relative group ${
          isActive
            ? 'shadow-xs ring-2'
            : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300'
        }`}
        style={
          isActive
            ? {
                backgroundColor: `${activePrimary}0C`,
                borderColor: activePrimary,
                outlineColor: `${activePrimary}30`
              }
            : {}
        }
      >
        <div 
          onClick={() => onSelectSlide(globalIndex)} 
          className="cursor-pointer"
        >
          <div className="flex items-start justify-between mb-1.5">
            <div className="flex items-center space-x-1.5">
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider transition-colors"
                style={
                  isActive
                    ? { backgroundColor: activePrimary, color: '#ffffff' }
                    : { backgroundColor: '#f1f5f9', color: '#475569' }
                }
              >
                {slide.slideNumber.toString().padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                {slide.eyebrow || (isPersonalized ? 'Personalized' : 'FocusRealm')}
              </span>
            </div>

            {isPersonalized && (
              <span
                className="w-2.5 h-2.5 rounded-full border border-slate-300 shrink-0"
                style={{ backgroundColor: slideBrand }}
                title="Target Hotel Brand Accent"
              />
            )}
          </div>

          <h4 
            className={`text-xs leading-snug line-clamp-1 pr-6 ${isActive ? 'font-bold' : 'font-semibold text-slate-800'}`}
            style={isActive ? { color: activePrimary } : {}}
          >
            {slide.title}
          </h4>
          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
            {slide.subtitle}
          </p>
        </div>

        {/* Quick Slide Action Buttons on Hover */}
        <div className="absolute right-2 top-2 hidden group-hover:flex items-center space-x-0.5 bg-white/95 rounded-md p-0.5 border border-slate-200 shadow-xs z-10">
          {onMoveSlide && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveSlide(globalIndex, 'up');
                }}
                disabled={globalIndex === 0}
                className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100 cursor-pointer"
                title="Move Slide Up"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveSlide(globalIndex, 'down');
                }}
                disabled={globalIndex === deck.slides.length - 1}
                className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100 cursor-pointer"
                title="Move Slide Down"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </>
          )}

          {onDuplicateSlide && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateSlide(globalIndex);
              }}
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              title="Duplicate Slide"
            >
              <Copy className="w-3 h-3" />
            </button>
          )}

          {onDeleteSlide && deck.slides.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSlide(globalIndex);
              }}
              className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
              title="Delete Slide"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>

        {isActive && (
          <div className="absolute right-2.5 bottom-2.5 pointer-events-none group-hover:hidden">
            <ChevronRight className="w-3.5 h-3.5" style={{ color: activePrimary }} />
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-72 bg-slate-50/70 border-r border-slate-200 h-[calc(100vh-4rem)] overflow-y-auto p-4 flex flex-col select-none no-print">
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: activePrimary }} />
            <span>Section 1: FocusRealm Core</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">1–{section1Slides.length}</span>
        </div>
        <div className="space-y-1">
          {section1Slides.map((slide, i) => renderThumbnail(slide, i))}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">
          <span className="flex items-center space-x-1.5">
            <UserCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Section 2: Personalized</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {section1Slides.length + 1}–{deck.slides.length}
          </span>
        </div>
        <div className="space-y-1">
          {section2Slides.map((slide, i) => renderThumbnail(slide, i + section1Slides.length))}
        </div>
      </div>

      {/* Add New Slide Button */}
      {onAddSlide && (
        <div className="pt-3">
          <button
            type="button"
            onClick={onAddSlide}
            className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 border border-dashed border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:border-slate-400 hover:bg-white transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-teal-600" />
            <span>Add Slide to Deck</span>
          </button>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-slate-200 text-[11px] text-slate-400 px-1">
        <p className="flex items-center space-x-1 font-medium text-slate-600">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span>{deck.slides.length}-Slide Executive Architecture</span>
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          Unified Canonical Engine • Real-time Sync
        </p>
      </div>
    </aside>
  );
};
