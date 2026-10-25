import React, { useState, useMemo } from 'react';
import { PresentationDeck } from '../types/presentation';
import { FolderOpen, Calendar, Trash2, ChevronRight, X, Sparkles, Search } from 'lucide-react';

interface DeckHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  decks: PresentationDeck[];
  activeDeckId: string | null;
  onSelectDeck: (deck: PresentationDeck) => void;
  onDeleteDeck: (deckId: string) => void;
  onNewDeck: () => void;
}

export const DeckHistoryModal: React.FC<DeckHistoryModalProps> = ({
  isOpen,
  onClose,
  decks,
  activeDeckId,
  onSelectDeck,
  onDeleteDeck,
  onNewDeck,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDecks = useMemo(() => {
    if (!searchQuery.trim()) return decks;
    const q = searchQuery.trim().toLowerCase();
    return decks.filter(d => {
      const nameMatch = d.companyName?.toLowerCase().includes(q);
      const propsMatch = (d.companyDossier?.properties || []).some((p: any) => {
        if (!p) return false;
        if (typeof p === 'string') return p.toLowerCase().includes(q);
        const combined = `${p.name || ''} ${p.location || ''} ${p.type || ''}`.toLowerCase();
        return combined.includes(q);
      });
      return Boolean(nameMatch || propsMatch);
    });
  }, [decks, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif">
                Presentation History
              </h2>
              <p className="text-xs text-slate-500">
                All saved first-call presentations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input in modal */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search presentations by hotel name..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {decks.length === 0 ? (
            <div className="text-center py-10">
              <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">No saved decks yet</p>
              <p className="text-xs text-slate-400 mt-1">Generate your first presentation to get started.</p>
              <button
                onClick={() => {
                  onClose();
                  onNewDeck();
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold bg-teal-800 hover:bg-teal-900 text-white rounded-lg transition-colors inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create New Presentation</span>
              </button>
            </div>
          ) : filteredDecks.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No presentations found matching "{searchQuery}".
            </div>
          ) : (
            filteredDecks.map((deck) => {
              const isActive = deck.id === activeDeckId;
              return (
                <div
                  key={deck.id}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-teal-50/70 border-teal-500 ring-1 ring-teal-500/30'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div
                    onClick={() => {
                      onSelectDeck(deck);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900">
                        {deck.companyName}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.2 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{new Date(deck.updatedAt).toLocaleDateString()}</span>
                      </span>
                      <span>•</span>
                      <span>8 Slides</span>
                      <span>•</span>
                      <span>{deck.companyDossier.properties.length} Properties</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onDeleteDeck(deck.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete deck"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        onSelectDeck(deck);
                        onClose();
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            Total Decks: {decks.length}
          </span>
          <button
            onClick={() => {
              onClose();
              onNewDeck();
            }}
            className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate New Deck</span>
          </button>
        </div>
      </div>
    </div>
  );
};
