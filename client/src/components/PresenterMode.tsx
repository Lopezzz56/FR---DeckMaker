import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PresentationDeck } from '../types/presentation';
import { FocusRealmLogo } from './FocusRealmLogo';
import { SlideViewer } from './SlideViewer';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';

interface PresenterModeProps {
  deck: PresentationDeck;
  initialSlideIndex?: number;
  onClose: () => void;
}

export const PresenterMode: React.FC<PresenterModeProps> = ({
  deck,
  initialSlideIndex = 0,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialSlideIndex);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slide = deck.slides[currentIndex];

  // Fullscreen toggle handler
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen toggle failed:', err);
    }
  }, []);

  // Listen for native browser fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);
      if (!active) {
        setShowControls(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Auto-hide controls in fullscreen after inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isFullscreen) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  useEffect(() => {
    if (!isFullscreen) {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    } else {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isFullscreen]);

  // Keyboard navigation & shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.min(prev + 1, deck.slides.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        if (!document.fullscreenElement) {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deck.slides.length, onClose, toggleFullscreen]);

  const handleExit = async () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      try {
        await document.exitFullscreen();
      } catch (e) {
        // Ignore exit error
      }
    }
    onClose();
  };

  // Click on slide to advance (unless clicking on controls)
  const handleStageClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('input')) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width * 0.2) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    } else {
      setCurrentIndex((prev) => Math.min(prev + 1, deck.slides.length - 1));
    }
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between select-none animate-in fade-in duration-150 overflow-hidden"
    >
      {/* Floating Top Header Bar (Auto-hides in fullscreen) */}
      <div 
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 px-6 py-3 bg-gradient-to-b from-black/85 via-black/50 to-transparent backdrop-blur-xs flex items-center justify-between ${
          showControls ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex items-center space-x-3 text-xs text-slate-300">
          <FocusRealmLogo size={28} />
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white tracking-tight text-sm">
              Focus Realm
            </span>
            <span>•</span>
            <span className="text-slate-300 font-medium truncate max-w-xs sm:max-w-md">
              {deck.companyName}
            </span>
          </div>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="bg-slate-900/90 border border-slate-700/80 text-teal-300 font-mono px-2.5 py-0.5 rounded text-xs font-semibold">
            {currentIndex + 1} / {deck.slides.length}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer shadow-md"
            title={isFullscreen ? 'Exit Full Screen (F)' : 'Enter Full Screen (F)'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">Full Screen</span>
              </>
            )}
            <span className="text-[10px] text-slate-400 font-mono">(F)</span>
          </button>

          {/* Exit Button */}
          <button
            onClick={handleExit}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer shadow-md"
            title="Exit Presentation Mode (ESC)"
          >
            <span>Exit</span>
            <span className="text-[10px] text-slate-400 font-mono">(ESC)</span>
            <X className="w-3.5 h-3.5 ml-0.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Slide Presentation Stage (100% full screen coverage) */}
      <div 
        onClick={handleStageClick}
        className={`w-full h-full flex items-center justify-center overflow-hidden cursor-default select-none ${
          isFullscreen ? 'p-0 m-0' : 'p-4 sm:p-6'
        }`}
      >
        {slide && (
          <SlideViewer
            deck={deck}
            slide={slide}
            activeSlideIndex={currentIndex}
            totalSlides={deck.slides.length}
            isPresentationMode={true}
            isFullscreen={isFullscreen}
          />
        )}
      </div>

      {/* Floating Bottom Navigation (Auto-hides in fullscreen) */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-30 transition-all duration-300 pb-4 pt-6 px-6 bg-gradient-to-t from-black/85 via-black/50 to-transparent backdrop-blur-xs flex flex-col items-center justify-center space-y-2 ${
          showControls ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentIndex === 0}
            className="flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 disabled:opacity-25 text-xs font-semibold text-white border border-slate-700 transition-colors cursor-pointer shadow-md"
            title="Previous (Left Arrow / Backspace)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Dot pagination */}
          <div className="flex items-center space-x-1.5 max-w-md overflow-x-auto py-1 px-2">
            {deck.slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                title={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === currentIndex ? 'bg-teal-400 w-6' : 'bg-slate-700 hover:bg-slate-500 w-2'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, deck.slides.length - 1))}
            disabled={currentIndex === deck.slides.length - 1}
            className="flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 disabled:opacity-25 text-xs font-semibold text-white border border-slate-700 transition-colors cursor-pointer shadow-md"
            title="Next (Right Arrow / Spacebar)"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcut Hint */}
        <p className="text-[11px] text-slate-400 tracking-wide font-normal hidden sm:block">
          Click slide or use <kbd className="px-1 py-0.5 bg-slate-900 rounded border border-slate-700 text-slate-300 font-mono">←</kbd> <kbd className="px-1 py-0.5 bg-slate-900 rounded border border-slate-700 text-slate-300 font-mono">→</kbd> <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700 text-slate-300 font-mono">Space</kbd> • <kbd className="px-1 py-0.5 bg-slate-900 rounded border border-slate-700 text-slate-300 font-mono">F</kbd> for Fullscreen • <kbd className="px-1 py-0.5 bg-slate-900 rounded border border-slate-700 text-slate-300 font-mono">ESC</kbd> to exit
        </p>
      </div>
    </div>
  );
};
