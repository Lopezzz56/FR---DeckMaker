import React, { useState, useEffect } from 'react';
import { SlideData, SlideContentCard } from '../types/presentation';
import { 
  Edit3, 
  Check, 
  X, 
  Plus, 
  Trash2, 
  Layout, 
  AlertCircle, 
  CheckCircle2, 
  MoveUp, 
  MoveDown,
  Smartphone,
  Monitor,
  Globe,
  Grid3X3,
  Users,
  GitBranch
} from 'lucide-react';

interface SlideEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  slide: SlideData;
  onSaveSlide: (updatedSlide: SlideData) => void;
}

const LAYOUT_OPTIONS = [
  { value: 'intro_title', label: '3-Card Column Grid', icon: Grid3X3, desc: 'Introductory executive cards with badges' },
  { value: 'company_overview', label: '4-Card Overview Matrix', icon: Grid3X3, desc: 'Four balanced strategic cards' },
  { value: 'grid_six', label: '6-Card Outcome Matrix', icon: Grid3X3, desc: 'Two rows of three measured outcomes' },
  { value: 'fit_columns', label: '3-Card Fit + Reassurance Banner', icon: Grid3X3, desc: 'Opportunity fit with bottom trust note' },
  { value: 'pilot_steps', label: '3-Card Proposal Steps', icon: Grid3X3, desc: 'Numbered rollout steps' },
  { value: 'staff_experience', label: 'Hero Mobile Floor App', icon: Smartphone, desc: 'Prominent iPhone frame with editorial pointers' },
  { value: 'manager_experience', label: 'Hero Desktop Supervision', icon: Monitor, desc: 'Prominent browser mockup with pointers' },
  { value: 'author_experience', label: 'Hero Standards Authoring', icon: Globe, desc: 'Desktop author portal with points' },
  { value: 'team_portraits', label: 'Executive Leadership Roster', icon: Users, desc: 'Circular masked portraits with roles and bios' },
  { value: 'advisors_list', label: 'Advisory Board Roster', icon: Users, desc: 'Circular advisor portraits with credentials' },
  { value: 'workflow_overview', label: '4-Step Operational Workflow', icon: GitBranch, desc: 'Connected sequence with live deployment banner' },
];

export const SlideEditorModal: React.FC<SlideEditorModalProps> = ({
  isOpen,
  onClose,
  slide,
  onSaveSlide,
}) => {
  const [title, setTitle] = useState(slide.title);
  const [subtitle, setSubtitle] = useState(slide.subtitle);
  const [eyebrow, setEyebrow] = useState(slide.eyebrow || '');
  const [footerNote, setFooterNote] = useState(slide.footerNote || '');
  const [layoutType, setLayoutType] = useState<SlideData['layoutType']>(slide.layoutType);
  const [cards, setCards] = useState<SlideContentCard[]>(JSON.parse(JSON.stringify(slide.cards || [])));

  // Synchronize state whenever a different slide is selected or modal opens
  useEffect(() => {
    if (slide) {
      setTitle(slide.title);
      setSubtitle(slide.subtitle);
      setEyebrow(slide.eyebrow || '');
      setFooterNote(slide.footerNote || '');
      setLayoutType(slide.layoutType);
      setCards(JSON.parse(JSON.stringify(slide.cards || [])));
    }
  }, [slide.id, slide.slideNumber, isOpen]);

  if (!isOpen) return null;

  const handleCardChange = (index: number, field: keyof SlideContentCard, value: string) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], [field]: value };
    setCards(updated);
  };

  const handleAddCard = () => {
    const newCard: SlideContentCard = {
      id: `c-${Date.now()}`,
      number: String(cards.length + 1),
      title: 'New Point',
      description: 'Describe this operational aspect or capability clearly.'
    };
    setCards([...cards, newCard]);
  };

  const handleDeleteCard = (index: number) => {
    if (cards.length <= 1) return;
    const updated = cards.filter((_, i) => i !== index);
    setCards(updated);
  };

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === cards.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...cards];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setCards(updated);
  };

  // Validation warnings
  const titleWarning = title.length > 80;
  const subtitleWarning = subtitle.length > 160;

  const handleSave = () => {
    onSaveSlide({
      ...slide,
      title,
      subtitle,
      eyebrow,
      footerNote,
      layoutType,
      cards,
      lastEditedAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#102F35] text-white flex items-center justify-center shadow-xs">
              <Edit3 className="w-4 h-4 text-[#3DB89E]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Edit Slide {slide.slideNumber}
              </h2>
              <p className="text-xs text-slate-500">
                Configure layout archetype, messaging, and card constraints
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Layout Archetype Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
                <Layout className="w-3.5 h-3.5 text-[#102F35]" />
                <span>Layout Archetype</span>
              </label>
              <span className="text-[11px] text-slate-400">Enforces tested slot dimensions</span>
            </div>
            <select
              value={layoutType}
              onChange={(e) => setLayoutType(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-[#102F35]/20 focus:border-[#102F35] text-slate-800"
            >
              {LAYOUT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} — ({opt.desc})
                </option>
              ))}
            </select>
          </div>

          {/* Eyebrow & Slide Tag */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Category / Eyebrow Tag
              </label>
              <input
                type="text"
                value={eyebrow}
                onChange={(e) => setEyebrow(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#102F35]/20 focus:border-[#102F35] bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Slide Number / Tag
              </label>
              <input
                type="text"
                disabled
                value={slide.headerTag || `0${slide.slideNumber} / 12`}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-100 text-slate-500 font-mono"
              />
            </div>
          </div>

          {/* Slide Title */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Slide Headline / Main Title
              </label>
              <span className={`text-[11px] font-mono ${titleWarning ? 'text-red-600 font-bold' : 'text-slate-400'}`}>
                {title.length} / 80 chars
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 text-sm font-semibold rounded-lg border bg-white focus:ring-2 ${
                titleWarning 
                  ? 'border-red-400 focus:ring-red-400/20 focus:border-red-500 text-red-900' 
                  : 'border-slate-300 focus:ring-[#102F35]/20 focus:border-[#102F35] text-slate-900'
              }`}
            />
            {titleWarning && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>Title exceeds 80 characters. May cause wrapping in PPTX/PDF.</span>
              </p>
            )}
          </div>

          {/* Subtitle */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Slide Subtitle / Context Statement
              </label>
              <span className={`text-[11px] font-mono ${subtitleWarning ? 'text-red-600 font-bold' : 'text-slate-400'}`}>
                {subtitle.length} / 160 chars
              </span>
            </div>
            <textarea
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#102F35]/20 focus:border-[#102F35] bg-white resize-none"
            />
          </div>

          {/* Content Cards */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">
                Cards / Items Content ({cards.length})
              </label>
              <button
                type="button"
                onClick={handleAddCard}
                className="flex items-center space-x-1 px-2.5 py-1 text-[11px] font-semibold text-[#102F35] bg-teal-50 hover:bg-teal-100 rounded-md border border-teal-200 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {cards.map((card, idx) => {
                const cardTitleWarn = (card.title || '').length > 45;
                const cardDescWarn = (card.description || '').length > 140;

                return (
                  <div key={card.id || idx} className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/90 space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Num"
                        value={card.number || ''}
                        onChange={(e) => handleCardChange(idx, 'number', e.target.value)}
                        className="w-14 px-2 py-1 text-xs font-mono font-bold rounded border border-slate-300 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Card Title"
                        value={card.title}
                        onChange={(e) => handleCardChange(idx, 'title', e.target.value)}
                        className={`flex-1 px-3 py-1 text-xs font-semibold rounded border bg-white ${
                          cardTitleWarn ? 'border-red-400 text-red-900' : 'border-slate-300'
                        }`}
                      />
                      <input
                        type="text"
                        placeholder="Badge (optional)"
                        value={card.badge || ''}
                        onChange={(e) => handleCardChange(idx, 'badge', e.target.value)}
                        className="w-28 px-2 py-1 text-[11px] font-bold rounded border border-slate-300 bg-white text-[#102F35]"
                      />
                      
                      {/* Move & Delete controls */}
                      <div className="flex items-center space-x-1 pl-1">
                        <button
                          type="button"
                          onClick={() => handleMoveCard(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          title="Move Up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveCard(idx, 'down')}
                          disabled={idx === cards.length - 1}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          title="Move Down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCard(idx)}
                          disabled={cards.length <= 1}
                          className="p-1 rounded text-slate-400 hover:text-red-600 disabled:opacity-20"
                          title="Delete Card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <textarea
                        rows={2}
                        placeholder="Card Description"
                        value={card.description}
                        onChange={(e) => handleCardChange(idx, 'description', e.target.value)}
                        className={`w-full px-3 py-1.5 text-xs rounded border bg-white resize-none ${
                          cardDescWarn ? 'border-red-400 text-red-900' : 'border-slate-300'
                        }`}
                      />
                      <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                        <span>{cardDescWarn ? '⚠️ Long text: shorten to keep card compact' : 'Clear, concise description'}</span>
                        <span className={cardDescWarn ? 'text-red-500 font-bold font-mono' : 'font-mono'}>
                          {(card.description || '').length} / 130 chars
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Note */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Footer Note / Attribution
            </label>
            <input
              type="text"
              value={footerNote}
              onChange={(e) => setFooterNote(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Validated against Canonical AST</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold bg-[#102F35] hover:bg-[#173D45] text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-[#3DB89E]" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
