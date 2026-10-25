import React from 'react';
import { CompanyDossier } from '../types/presentation';
import { 
  FileCheck, 
  ExternalLink, 
  CheckCircle2, 
  HelpCircle, 
  Building2, 
  Globe, 
  X, 
  ShieldAlert,
  Info
} from 'lucide-react';

interface ResearchSourcesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dossier: CompanyDossier;
}

export const ResearchSourcesDrawer: React.FC<ResearchSourcesDrawerProps> = ({
  isOpen,
  onClose,
  dossier,
}) => {
  if (!isOpen) return null;

  const verifiedFacts = dossier.factsAndHypotheses.filter(f => f.type === 'verified_fact');
  const hypotheses = dossier.factsAndHypotheses.filter(f => f.type === 'inferred_hypothesis');

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white h-full border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Research & Fact Verification
              </h2>
              <p className="text-xs text-slate-500">
                Sources and ground truth for {dossier.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Ground Truth Guarantee Notice */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Strict Accuracy Standards</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              FocusRealm presentations strictly separate verified operational facts from reasonable operational hypotheses. All company facts are linked to public or provided sources.
            </p>
          </div>

          {/* Properties & Operational Footprint */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Identified Portfolio ({dossier.properties.length})</span>
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {dossier.properties.map((prop, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span>{prop.name}</span>
                    <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono">
                      {prop.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{prop.location}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Claims (Green) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Facts ({verifiedFacts.length})</span>
              </h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Public Records
              </span>
            </div>
            <div className="space-y-2.5">
              {verifiedFacts.map((fact) => (
                <div key={fact.id} className="p-3.5 bg-emerald-50/40 border border-emerald-200/70 rounded-xl text-xs space-y-1.5">
                  <p className="text-slate-800 font-medium leading-relaxed">
                    &quot;{fact.statement}&quot;
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-emerald-200/40 text-[11px]">
                    <span className="text-slate-500">{fact.relevance}</span>
                    {fact.sourceUrl && (
                      <a
                        href={fact.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-blue-600 hover:underline font-medium"
                      >
                        <span>Source</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Hypotheses (Amber) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Operational Hypotheses ({hypotheses.length})</span>
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                Flagged for Client Alignment
              </span>
            </div>
            <div className="space-y-2.5">
              {hypotheses.map((hyp) => (
                <div key={hyp.id} className="p-3.5 bg-amber-50/40 border border-amber-200/70 rounded-xl text-xs space-y-1.5">
                  <p className="text-slate-800 font-medium leading-relaxed">
                    &quot;{hyp.statement}&quot;
                  </p>
                  <p className="text-[11px] text-amber-800 italic">
                    Reasoning: {hyp.relevance}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Web Sources & Crawled URLs */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>Research Citations ({dossier.sources.length})</span>
            </h3>
            <div className="space-y-2">
              {dossier.sources.map((src, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{src.title}</span>
                    <span className="text-[10px] font-mono text-slate-400">{src.domain}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {src.snippet}
                  </p>
                  <div className="mt-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Accessed {new Date(src.accessedAt).toLocaleDateString()}</span>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <span>Visit Link</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
