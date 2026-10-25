import React, { useState } from 'react';
import { 
  Building2, 
  Globe, 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  X,
  Compass
} from 'lucide-react';
import { FocusRealmLogo } from './FocusRealmLogo';

interface GeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: {
    companyName: string;
    websiteUrl: string;
    userNotes: string;
    uploadedText: string;
  }) => Promise<void>;
  isGenerating: boolean;
  generationStep: string;
  initialCompanyName?: string;
}

const SAMPLE_HOTELS = [
  { name: 'Marriott International', url: 'https://marriott.com', note: 'Global luxury hotel & resort chain' },
  { name: 'Mathur Hospitality', url: 'https://mathurhospitality.com', note: 'Luxury boutique resort & villa operator in Maharashtra' },
  { name: 'The Oberoi Group', url: 'https://www.oberoihotels.com', note: 'Legendary palace & heritage resort hospitality' },
  { name: 'Soneva Resorts', url: 'https://soneva.com', note: 'Ultra-luxury island villas & eco-sustainability standards' }
];

export const GeneratorModal: React.FC<GeneratorModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
  generationStep,
  initialCompanyName,
}) => {
  const [companyName, setCompanyName] = useState('Mathur Hospitality');
  const [websiteUrl, setWebsiteUrl] = useState('https://mathurhospitality.com');
  const [userNotes, setUserNotes] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedText, setUploadedText] = useState('');

  React.useEffect(() => {
    if (initialCompanyName) {
      setCompanyName(initialCompanyName);
      const sample = SAMPLE_HOTELS.find(s => s.name.toLowerCase() === initialCompanyName.toLowerCase());
      if (sample) {
        setWebsiteUrl(sample.url);
        setUserNotes(sample.note);
      } else {
        setWebsiteUrl(`https://${initialCompanyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`);
        setUserNotes(`Executive hospitality partner analysis for ${initialCompanyName}`);
      }
    }
  }, [initialCompanyName, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedText(event.target?.result as string || '');
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    await onGenerate({
      companyName,
      websiteUrl,
      userNotes,
      uploadedText
    });
  };

  const selectSample = (sample: typeof SAMPLE_HOTELS[0]) => {
    setCompanyName(sample.name);
    setWebsiteUrl(sample.url);
    setUserNotes(sample.note);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <FocusRealmLogo size={32} />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                New Executive Presentation
              </h2>
              <p className="text-xs text-slate-500">
                Researched, personalized 8-slide deck for FocusRealm
              </p>
            </div>
          </div>

          {!isGenerating && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quick Preset Samples */}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5 flex items-center space-x-1">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>Quick Hospitality Profiles:</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_HOTELS.map((sample) => (
                <button
                  key={sample.name}
                  type="button"
                  onClick={() => selectSample(sample)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    companyName === sample.name
                      ? 'bg-blue-50 border-blue-400 text-blue-800 font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Hotel or Hospitality Company Name *
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                disabled={isGenerating}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Mathur Hospitality or The Oberoi Group"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 bg-white"
              />
            </div>
          </div>

          {/* Website URL */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Website URL (Optional for live brand & property research)
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                disabled={isGenerating}
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 bg-white"
              />
            </div>
          </div>

          {/* File Upload / Briefing Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Document Upload / Context (Optional)
            </label>
            <div className="border border-dashed border-slate-300 rounded-lg p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <input
                type="file"
                id="file-upload"
                disabled={isGenerating}
                onChange={handleFileUpload}
                accept=".txt,.md,.pdf,.doc,.docx"
                className="hidden"
              />
              <label 
                htmlFor="file-upload" 
                className="flex items-center justify-center space-x-2 cursor-pointer text-xs text-slate-600"
              >
                <Upload className="w-4 h-4 text-blue-600" />
                <span>{uploadedFile ? uploadedFile.name : 'Upload notes, RFP or property brief (.txt, .md, .pdf)'}</span>
              </label>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Additional Instructions / Operational Focus (Optional)
            </label>
            <textarea
              rows={2}
              disabled={isGenerating}
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="e.g. Focus on housekeeping supervision across lake villas and owner reporting transparency..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 bg-white resize-none"
            />
          </div>

          {/* Live Progress feedback if generating */}
          {isGenerating && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center space-x-4">
              <FocusRealmLogo size={46} animated={true} />
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {generationStep || 'Researching company & synthesizing deck...'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden relative">
                  <div className="h-full bg-teal-600 rounded-full animate-loader-bar" />
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  Scanning property records, extracting brand colors, and grounding factual claims.
                </p>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-200">
            <button
              type="button"
              disabled={isGenerating}
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating || !companyName.trim()}
              className="px-5 py-2 text-xs font-semibold bg-[#102F35] hover:bg-[#0b2126] text-white rounded-lg shadow-sm transition-colors flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
                  <span>Researching & Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>Generate Presentation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
