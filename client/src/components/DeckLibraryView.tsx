import React, { useState, useMemo } from 'react';
import { PresentationDeck } from '../types/presentation';
import { 
  Search, 
  Sparkles, 
  FolderOpen, 
  Calendar, 
  Building2, 
  Layers, 
  Play, 
  Download, 
  Printer, 
  Trash2, 
  ArrowRight, 
  FileCheck
} from 'lucide-react';

interface DeckLibraryViewProps {
  decks: PresentationDeck[];
  activeDeckId: string | null;
  onSelectDeck: (deck: PresentationDeck) => void;
  onOpenStudio: () => void;
  onNewDeck: (initialCompany?: string) => void;
  onDeleteDeck: (deckId: string) => void;
  onExportPptx: (deck: PresentationDeck) => void;
  onExportPdf: (deck: PresentationDeck) => void;
  onStartPresenting: (deck: PresentationDeck) => void;
}

export const DeckLibraryView: React.FC<DeckLibraryViewProps> = ({
  decks,
  activeDeckId,
  onSelectDeck,
  onOpenStudio,
  onNewDeck,
  onDeleteDeck,
  onExportPptx,
  onExportPdf,
  onStartPresenting,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'properties'>('date');

  // Filter and sort decks
  const filteredDecks = useMemo(() => {
    return decks.filter((deck) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;

      const nameMatch = deck.companyName?.toLowerCase().includes(q);
      const businessModelMatch = deck.companyDossier?.businessModel?.toLowerCase().includes(q);
      const taglineMatch = deck.companyDossier?.tagline?.toLowerCase().includes(q);
      const propertiesMatch = (deck.companyDossier?.properties || []).some((p: any) => {
        if (!p) return false;
        if (typeof p === 'string') return p.toLowerCase().includes(q);
        const combined = `${p.name || ''} ${p.location || ''} ${p.type || ''}`.toLowerCase();
        return combined.includes(q);
      });

      return Boolean(nameMatch || businessModelMatch || taglineMatch || propertiesMatch);
    }).sort((a, b) => {
      if (sortBy === 'name') {
        return a.companyName.localeCompare(b.companyName);
      }
      if (sortBy === 'properties') {
        return (b.companyDossier?.properties?.length || 0) - (a.companyDossier?.properties?.length || 0);
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [decks, searchQuery, sortBy]);

  return (
    <div className="flex-1 bg-slate-50/70 overflow-y-auto">
      {/* Top Banner & Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 font-serif tracking-tight">
                All Presentations
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Select a presentation to open in the studio or create a new client deck.
              </p>
            </div>

            <div className="flex items-center space-x-3 flex-shrink-0">
              <button
                onClick={() => onNewDeck()}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>+ New Presentation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Sort Toolbar */}
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hotel name, location, properties..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Count & Sorting */}
          <div className="flex items-center space-x-4 text-xs text-slate-500 w-full md:w-auto justify-between md:justify-end">
            <span className="font-medium text-slate-600">
              {filteredDecks.length} of {decks.length} presentations
            </span>

            <div className="flex items-center space-x-2">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
              >
                <option value="date">Recently Updated</option>
                <option value="name">Company Name (A-Z)</option>
                <option value="properties">Properties Count</option>
              </select>
            </div>
          </div>
        </div>

        {/* Presentations Grid */}
        <div className="mt-6">
          {filteredDecks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">No presentations match your search</h3>
              <p className="text-xs text-slate-500 mb-5">
                Try searching for another hotel name or generate a new tailored first-call presentation.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer mr-2"
              >
                Clear Search
              </button>
              <button
                onClick={() => onNewDeck()}
                className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer"
              >
                Generate New Deck
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDecks.map((deck) => {
                const isActive = deck.id === activeDeckId;
                const isMise = deck.theme.focusRealmPalette.primary.toLowerCase() === '#102f35';
                const targetColor = deck.theme.targetBrandPalette.primary || '#102f35';
                const introSlide = deck.slides.find(s => s.layoutType === 'intro_title') || deck.slides[0];

                return (
                  <div
                    key={deck.id}
                    className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md group relative ${
                      isActive 
                        ? 'border-teal-500 ring-2 ring-teal-500/20' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Top Color Stripe */}
                    <div 
                      className="h-2 w-full"
                      style={{ backgroundColor: targetColor }}
                    />

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Top Metadata Badges */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center space-x-1.5">
                            <span 
                              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                              style={{ 
                                backgroundColor: `${targetColor}15`, 
                                color: targetColor 
                              }}
                            >
                              {deck.companyName}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                              {isMise ? 'Mise' : 'Classic'}
                            </span>
                          </div>

                          {isActive && (
                            <span className="text-[10px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded-full flex items-center space-x-1">
                              <span>Active</span>
                            </span>
                          )}
                        </div>

                        {/* Company Title */}
                        <h2 className="text-lg font-bold text-slate-900 font-serif leading-tight mb-1 group-hover:text-teal-900 transition-colors">
                          {deck.companyName}
                        </h2>

                        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                          {introSlide?.subtitle || deck.companyDossier?.operationalContext?.[0] || 'Executive First-Call Presentation tailored to hotel operations.'}
                        </p>

                        {/* Dossier Quick Facts Pill */}
                        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 mb-4">
                          <div className="flex items-center space-x-1.5">
                            <Layers className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                            <span>10 Executive Slides</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <span>{deck.companyDossier.properties?.length || 1} Properties</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <FileCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span>{deck.companyDossier.factsAndHypotheses?.length || 6} Grounded Facts</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span>{new Date(deck.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Color Theme Swatches */}
                        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                          <span>Brand Palette:</span>
                          <div className="flex items-center space-x-1">
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-white shadow-xs inline-block" 
                              style={{ backgroundColor: deck.theme.focusRealmPalette.primary }}
                              title="FocusRealm Primary"
                            />
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-white shadow-xs inline-block" 
                              style={{ backgroundColor: deck.theme.targetBrandPalette.primary }}
                              title="Target Hotel Primary"
                            />
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-white shadow-xs inline-block" 
                              style={{ backgroundColor: deck.theme.targetBrandPalette.accent }}
                              title="Target Hotel Accent"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Primary Open Action & Toolbar */}
                      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                        <button
                          onClick={() => {
                            onSelectDeck(deck);
                            onOpenStudio();
                          }}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                            isActive
                              ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-sm'
                              : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                          }`}
                        >
                          <span>Open in Presentation Studio</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        {/* Secondary Actions Toolbar */}
                        <div className="flex items-center justify-between pt-1 text-slate-500">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => onStartPresenting(deck)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                              title="Launch Fullscreen Presenter Mode"
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onExportPptx(deck)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                              title="Download PowerPoint Presentation (.pptx)"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onExportPdf(deck)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                              title="Download 16:9 Presentation PDF"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => onDeleteDeck(deck.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete presentation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
