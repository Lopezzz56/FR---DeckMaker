import React, { useState, useEffect } from 'react';
import { BrandPalette } from '../types/presentation';
import { Palette, Check, Sparkles, X, RefreshCw } from 'lucide-react';

// FocusRealm Core Themes (Old Classic vs New Mise Authentic)
export const MISE_AUTHENTIC_THEME: BrandPalette = {
  primary: '#102f35',    // Deep Forest Green
  secondary: '#173d45',  // Forest Teal
  accent: '#3db89e',     // Vibrant Mint / Teal
  background: '#f5f2e9', // Warm Parchment
  surface: '#ffffff',    // Crisp Surface
  text: '#102f35',       // Deep Forest Ink
  textMuted: '#577176',  // Forest Slate
  border: '#d8d2c4'      // Warm border
};

export const FOCUSREALM_CLASSIC_THEME: BrandPalette = {
  primary: '#1e40af',    // Executive Blue
  secondary: '#0f172a',  // Deep Slate
  accent: '#2563eb',     // Royal Blue
  background: '#f8fafc', // Slate 50
  surface: '#ffffff',
  text: '#0f172a',
  textMuted: '#64748b',
  border: '#e2e8f0'
};

const PRESET_HOTEL_PALETTES = [
  { name: 'Oberoi Palace Gold & Amber', primary: '#a16207', accent: '#ca8a04', secondary: '#1c1917', background: '#fdfbf7', border: '#e7e5e4' },
  { name: 'Mathur Hospitality Emerald', primary: '#047857', accent: '#059669', secondary: '#064e3b', background: '#f0fdf4', border: '#bbf7d0' },
  { name: 'Heritage Forest & Champagne', primary: '#1e3a2f', accent: '#b89058', secondary: '#0f172a', background: '#f5f2e9', border: '#d8d2c4' },
  { name: 'Soneva Terracotta & Sand', primary: '#9a3412', accent: '#d97706', secondary: '#431407', background: '#fffbeb', border: '#fed7aa' },
  { name: 'Modern Azure & Sapphire', primary: '#0369a1', accent: '#0284c7', secondary: '#0c4a6e', background: '#f0f9ff', border: '#bae6fd' }
];

interface BrandPaletteEditorProps {
  isOpen: boolean;
  onClose: () => void;
  targetPalette: BrandPalette;
  corePalette?: BrandPalette;
  companyName: string;
  onUpdatePalettes: (updatedTarget: BrandPalette, updatedCore: BrandPalette) => void;
}

export const BrandPaletteEditor: React.FC<BrandPaletteEditorProps> = ({
  isOpen,
  onClose,
  targetPalette,
  corePalette = MISE_AUTHENTIC_THEME,
  companyName,
  onUpdatePalettes,
}) => {
  const [selectedCoreTheme, setSelectedCoreTheme] = useState<'mise' | 'classic'>(
    corePalette.primary === FOCUSREALM_CLASSIC_THEME.primary ? 'classic' : 'mise'
  );

  const [primary, setPrimary] = useState(targetPalette.primary);
  const [accent, setAccent] = useState(targetPalette.accent);
  const [secondary, setSecondary] = useState(targetPalette.secondary);
  const [bg, setBg] = useState(targetPalette.background || '#f8fafc');

  useEffect(() => {
    setPrimary(targetPalette.primary);
    setAccent(targetPalette.accent);
    setSecondary(targetPalette.secondary);
    setBg(targetPalette.background || '#f8fafc');
    setSelectedCoreTheme(
      corePalette.primary === FOCUSREALM_CLASSIC_THEME.primary ? 'classic' : 'mise'
    );
  }, [targetPalette, corePalette, isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    const updatedCore = selectedCoreTheme === 'classic' ? FOCUSREALM_CLASSIC_THEME : MISE_AUTHENTIC_THEME;
    const updatedTarget: BrandPalette = {
      ...targetPalette,
      primary,
      accent,
      secondary,
      background: bg,
      isCustomized: true
    };
    onUpdatePalettes(updatedTarget, updatedCore);
    onClose();
  };

  const handleSelectPreset = (preset: typeof PRESET_HOTEL_PALETTES[0]) => {
    setPrimary(preset.primary);
    setAccent(preset.accent);
    setSecondary(preset.secondary);
    setBg(preset.background);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Brand Palette & Theme System
              </h3>
              <p className="text-xs text-slate-500">
                Seamlessly toggle FocusRealm theme and target brand styling
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* SECTION 1: FocusRealm Brand Theme Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <span>1. FocusRealm Core Theme</span>
                <span className="text-[10px] font-normal normal-case text-slate-500">(Section 1: Slides 1–6)</span>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* Mise Authentic */}
              <button
                type="button"
                onClick={() => setSelectedCoreTheme('mise')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  selectedCoreTheme === 'mise'
                    ? 'border-teal-600 bg-teal-50/40 ring-2 ring-teal-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <span>🌿 Mise Authentic</span>
                  </span>
                  {selectedCoreTheme === 'mise' && (
                    <Check className="w-3.5 h-3.5 text-teal-600" />
                  )}
                </div>
                <div className="flex items-center space-x-1.5 mb-2">
                  <div className="w-5 h-5 rounded-md bg-[#102f35]" title="#102f35 Forest" />
                  <div className="w-5 h-5 rounded-md bg-[#3db89e]" title="#3db89e Mint" />
                  <div className="w-5 h-5 rounded-md bg-[#f5f2e9] border border-slate-300" title="#f5f2e9 Parchment" />
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Forest green & warm parchment identity from live platform
                </p>
              </button>

              {/* Classic Executive Blue */}
              <button
                type="button"
                onClick={() => setSelectedCoreTheme('classic')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  selectedCoreTheme === 'classic'
                    ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <span>💎 Classic Executive</span>
                  </span>
                  {selectedCoreTheme === 'classic' && (
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                  )}
                </div>
                <div className="flex items-center space-x-1.5 mb-2">
                  <div className="w-5 h-5 rounded-md bg-[#1e40af]" title="#1e40af Blue" />
                  <div className="w-5 h-5 rounded-md bg-[#2563eb]" title="#2563eb Royal" />
                  <div className="w-5 h-5 rounded-md bg-[#f8fafc] border border-slate-300" title="#f8fafc Slate" />
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Original high-contrast executive navy & crisp slate theme
                </p>
              </button>
            </div>
          </div>

          <div className="h-[1px] bg-slate-200" />

          {/* SECTION 2: Target Hotel Brand Customization */}
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              <span>2. Target Client Brand Palette</span>
              <span className="text-[10px] font-normal normal-case text-slate-500 ml-2">
                (Section 2: Slides 7–10 for {companyName})
              </span>
            </label>

            {/* Color Pickers */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Primary Accent Color (Headers, Badges, Stripes)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={primary}
                    onChange={(e) => setPrimary(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={primary}
                    onChange={(e) => setPrimary(e.target.value)}
                    className="w-28 px-2.5 py-1.5 text-xs font-mono font-medium rounded-lg border border-slate-300 bg-white uppercase"
                  />
                  <div 
                    className="flex-1 h-9 rounded-lg border flex items-center justify-center text-xs font-semibold text-white shadow-2xs"
                    style={{ backgroundColor: primary }}
                  >
                    Primary Preview
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Secondary Highlight Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={accent}
                    onChange={(e) => setAccent(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={accent}
                    onChange={(e) => setAccent(e.target.value)}
                    className="w-28 px-2.5 py-1.5 text-xs font-mono font-medium rounded-lg border border-slate-300 bg-white uppercase"
                  />
                  <div 
                    className="flex-1 h-9 rounded-lg border flex items-center justify-center text-xs font-semibold text-white shadow-2xs"
                    style={{ backgroundColor: accent }}
                  >
                    Accent Preview
                  </div>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-2">
                Curated Luxury Hospitality Palettes:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {PRESET_HOTEL_PALETTES.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="flex items-center space-x-1">
                        <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.primary }} />
                        <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.accent }} />
                      </div>
                      <span className="text-xs font-medium text-slate-800">{preset.name}</span>
                    </div>
                    {primary.toLowerCase() === preset.primary.toLowerCase() && (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedCoreTheme('mise');
              setPrimary(MISE_AUTHENTIC_THEME.primary);
              setAccent(MISE_AUTHENTIC_THEME.accent);
            }}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset to Authentic Mise</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors cursor-pointer flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Theme & Palette</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
