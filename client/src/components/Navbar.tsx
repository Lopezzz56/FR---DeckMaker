import React from 'react';
import { PresentationDeck } from '../types/presentation';
import { FocusRealmLogo } from './FocusRealmLogo';
import { 
  Download, 
  Play, 
  Plus, 
  FolderOpen, 
  Palette, 
  FileCheck, 
  Printer,
  Sparkles,
  Loader2
} from 'lucide-react';

interface NavbarProps {
  currentDeck: PresentationDeck | null;
  decks: PresentationDeck[];
  currentView: 'studio' | 'library';
  onSwitchView: (view: 'studio' | 'library') => void;
  onSelectDeck: (deck: PresentationDeck) => void;
  onNewDeck: () => void;
  onOpenHistory: () => void;
  onOpenBrandEditor: () => void;
  onOpenSources: () => void;
  onStartPresenting: () => void;
  onExportPptx: () => void;
  onExportPdf: () => void;
  isExporting: boolean;
  exportType?: 'pptx' | 'pdf' | null;
  saveStatus: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentDeck,
  decks = [],
  currentView,
  onSwitchView,
  onSelectDeck,
  onNewDeck,
  onOpenHistory,
  onOpenBrandEditor,
  onOpenSources,
  onStartPresenting,
  onExportPptx,
  onExportPdf,
  isExporting,
  exportType,
  saveStatus,
}) => {
  const isMiseTheme = currentDeck?.theme.focusRealmPalette.primary === '#102f35';

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 select-none shadow-xs no-print">
      {/* Left: Product Branding & Deck Indicator */}
      <div className="flex items-center space-x-4">
        <div 
          onClick={() => onSwitchView('library')}
          className="flex items-center space-x-2.5 cursor-pointer group"
          title="Back to Presentations Library"
        >
          <FocusRealmLogo 
            size={36} 
            primaryColor={currentDeck?.theme.focusRealmPalette.primary || '#102F35'} 
            accentColor={currentDeck?.theme.focusRealmPalette.accent || '#3DB89E'} 
          />
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-900 tracking-tight text-sm group-hover:text-teal-900 transition-colors">
              Focus Realm
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-600 font-medium">
              First Call Deck Studio
            </span>
          </div>
        </div>

        {/* Studio Mode: Active Presentation Info */}
        {currentDeck && currentView === 'studio' && (
          <div className="hidden md:flex items-center pl-4 border-l border-slate-200 space-x-2 text-xs">
            <span className="font-semibold text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
              {currentDeck.companyName}
            </span>
            <span className="text-[11px] text-slate-400">
              • {saveStatus}
            </span>
          </div>
        )}
      </div>

      {/* Right: Studio Actions */}
      <div className="flex items-center space-x-2.5">
        {currentView === 'studio' && currentDeck && (
          <>
            {/* Brand Colors & Theme Toggle Button */}
            <button
              onClick={onOpenBrandEditor}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              title="Theme and Brand Palette Configuration"
            >
              <Palette className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">Theme & Colors</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-600 border border-slate-200">
                {isMiseTheme ? '🌿 Mise' : '💎 Classic'}
              </span>
              <span
                className="w-2.5 h-2.5 rounded-full border border-slate-300"
                style={{ backgroundColor: currentDeck.theme.targetBrandPalette.primary }}
                title="Target Brand Color"
              />
            </button>

            <button
              onClick={onOpenSources}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              title="Verified Research Sources & Fact Check"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Research & Facts</span>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-1.5 py-0.2 rounded-full border border-emerald-200">
                {currentDeck.companyDossier.factsAndHypotheses.length}
              </span>
            </button>

            <button
              onClick={onStartPresenting}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              title="Fullscreen Presentation Mode"
            >
              <Play className="w-3.5 h-3.5 text-slate-600" />
              <span>Present</span>
            </button>

            {/* High-Resolution PDF Download */}
            <button
              onClick={onExportPdf}
              disabled={isExporting}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
              title="Download High-Resolution 16:9 Presentation PDF"
            >
              {isExporting && exportType === 'pdf' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
              ) : (
                <Printer className="w-3.5 h-3.5 text-slate-600" />
              )}
              <span>{isExporting && exportType === 'pdf' ? 'Rendering PDF...' : 'PDF'}</span>
            </button>

            {/* PPTX Download */}
            <button
              onClick={onExportPptx}
              disabled={isExporting}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              style={{ backgroundColor: currentDeck.theme.focusRealmPalette.primary }}
            >
              {isExporting && exportType === 'pptx' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isExporting && exportType === 'pptx' ? 'Generating...' : 'Export PPTX'}</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};
