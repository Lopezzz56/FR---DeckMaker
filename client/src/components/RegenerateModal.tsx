import React, { useState } from 'react';
import { SlideData } from '../types/presentation';
import { Sparkles, Loader2, X, Lightbulb } from 'lucide-react';

interface RegenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  slide: SlideData;
  onRegenerate: (slideId: string, prompt: string) => Promise<void>;
  isRegenerating: boolean;
}

const PRESET_PROMPTS: Record<number, string[]> = {
  1: [
    'Emphasize operational accountability and executive leadership',
    'Focus on service execution platform positioning'
  ],
  2: [
    'Emphasize hospitality operations background of leadership team',
    'Highlight direct floor experience and software craftsmanship'
  ],
  3: [
    'Emphasize luxury training and standards development pedigree',
    'Highlight decades of 5-star brand identity and operational auditing'
  ],
  4: [
    'Focus on supervisor bottleneck in multi-villa and expansive resorts',
    'Emphasize audit ambush and owner evidence preparation'
  ],
  5: [
    'Highlight 4-step execution flow: Standard, Task, Phone, Record',
    'Focus on live platform deployment with instant offline sync'
  ],
  6: [
    'Highlight mobile ease of use for floor room attendants',
    'Emphasize rooms in sequence and clear timed shift windows'
  ],
  7: [
    'Focus on real-time manager supervision and exception handling',
    'Emphasize shift room assignment and unknown attendance resolution'
  ],
  8: [
    'Highlight SOP authoring studio and version-controlled standard publishing',
    'Emphasize tamper-proof task linking across portfolio properties'
  ],
  9: [
    'Focus on supervisor time saved and room inspection speed',
    'Emphasize immediate audit readiness for brand and owner reviews'
  ],
  10: [
    'Focus heavily on luxury villas and decentralized resort grounds',
    'Emphasize boutique service discipline and bespoke guest rituals'
  ],
  11: [
    'Connect specifically to seasonal staff turnover and rapid shift onboarding',
    'Highlight supervisor transit time across expansive property wings'
  ],
  12: [
    'Suggest a guided remote shift launch alongside property leadership',
    'Focus on low-risk 1-shift pilot with 1 manager and 1 room attendant'
  ]
};

export const RegenerateModal: React.FC<RegenerateModalProps> = ({
  isOpen,
  onClose,
  slide,
  onRegenerate,
  isRegenerating,
}) => {
  const [prompt, setPrompt] = useState('');

  if (!isOpen) return null;

  const suggestions = PRESET_PROMPTS[slide.slideNumber] || [
    'Make the tone more direct and executive',
    'Focus on multi-property consistency'
  ];

  const handleApplyPreset = (presetText: string) => {
    setPrompt(presetText);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onRegenerate(slide.id, prompt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Regenerate Slide {slide.slideNumber}
              </h2>
              <p className="text-xs text-slate-500">
                Refine content without affecting other slides
              </p>
            </div>
          </div>
          {!isRegenerating && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Current Headline
            </span>
            <p className="text-xs font-semibold text-slate-900 line-clamp-1">
              {slide.title}
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center space-x-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Suggested Refinement Prompts:</span>
            </label>
            <div className="space-y-1.5">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleApplyPreset(sug)}
                  className="w-full text-left p-2 rounded-lg border border-slate-200 text-xs text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  &quot;{sug}&quot;
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Custom AI Instructions for this Slide (Optional)
            </label>
            <textarea
              rows={3}
              disabled={isRegenerating}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Highlight supervisor bottleneck in luxury lake villas and focus on owner reporting..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 bg-white resize-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              disabled={isRegenerating}
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRegenerating}
              className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 disabled:opacity-50"
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Regenerating Slide...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Regenerate Slide</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
