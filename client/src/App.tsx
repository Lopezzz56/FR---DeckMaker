import React, { useState, useEffect } from 'react';
import { PresentationDeck, SlideData, BrandPalette } from './types/presentation';
import { Navbar } from './components/Navbar';
import { SlideThumbnailList } from './components/SlideThumbnailList';
import { SlideViewer } from './components/SlideViewer';
import { GeneratorModal } from './components/GeneratorModal';
import { BrandPaletteEditor } from './components/BrandPaletteEditor';
import { ResearchSourcesDrawer } from './components/ResearchSourcesDrawer';
import { SlideEditorModal } from './components/SlideEditorModal';
import { RegenerateModal } from './components/RegenerateModal';
import { PresenterMode } from './components/PresenterMode';
import { DeckHistoryModal } from './components/DeckHistoryModal';
import { DeckLibraryView } from './components/DeckLibraryView';
import { FocusRealmLogo } from './components/FocusRealmLogo';
import { FocusRealmLoader } from './components/FocusRealmLoader';
import { exportDeckToPdf } from './utils/pdfExport';
import { Loader2, Sparkles, Building2, Layers } from 'lucide-react';

export function App() {
  const [decks, setDecks] = useState<PresentationDeck[]>([]);
  const [currentDeck, setCurrentDeck] = useState<PresentationDeck | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportType, setExportType] = useState<'pptx' | 'pdf' | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('Auto-saved');

  // View state: 'library' (all presentations dashboard) or 'studio' (16:9 canvas workspace)
  const [currentView, setCurrentView] = useState<'studio' | 'library'>('library');
  const [presetCompanyName, setPresetCompanyName] = useState<string>('');

  // Modal / Drawer visibility states
  const [isGeneratorOpen, setIsGeneratorOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isBrandEditorOpen, setIsBrandEditorOpen] = useState<boolean>(false);
  const [isSourcesDrawerOpen, setIsSourcesDrawerOpen] = useState<boolean>(false);
  const [isSlideEditorOpen, setIsSlideEditorOpen] = useState<boolean>(false);
  const [isRegenerateOpen, setIsRegenerateOpen] = useState<boolean>(false);
  const [isPresenterOpen, setIsPresenterOpen] = useState<boolean>(false);

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  // Initial load
  useEffect(() => {
    fetchDecks();
  }, []);

  // Keyboard navigation for editor canvas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if modal or drawer is open
      if (
        isSlideEditorOpen ||
        isGeneratorOpen ||
        isPresenterOpen ||
        isBrandEditorOpen ||
        isHistoryOpen ||
        isRegenerateOpen ||
        isSourcesDrawerOpen
      ) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        setActiveSlideIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'ArrowRight') {
        setActiveSlideIndex((prev) =>
          currentDeck ? Math.min(prev + 1, currentDeck.slides.length - 1) : prev
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentDeck,
    isSlideEditorOpen,
    isGeneratorOpen,
    isPresenterOpen,
    isBrandEditorOpen,
    isHistoryOpen,
    isRegenerateOpen,
    isSourcesDrawerOpen
  ]);

  const fetchDecks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/decks');
      if (res.ok) {
        const data: PresentationDeck[] = await res.json();
        setDecks(data);
        if (data.length > 0) {
          setCurrentDeck(data[0]);
        } else {
          // If empty, auto-generate the reference demo deck for Mathur Hospitality
          await generateInitialDemoDeck();
        }
      }
    } catch (err) {
      console.error('Failed to load decks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateInitialDemoDeck = async () => {
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: 'Mathur Hospitality' })
      });
      if (res.ok) {
        const deck: PresentationDeck = await res.json();
        setDecks([deck]);
        setCurrentDeck(deck);
      }
    } catch (err) {
      console.error('Failed to generate initial demo deck:', err);
    }
  };

  // Generate new deck handler
  const handleGenerate = async (params: {
    companyName: string;
    websiteUrl: string;
    userNotes: string;
    uploadedText: string;
  }) => {
    setIsGenerating(true);
    setGenerationStep('Step 1/4: Discovering company domain & property records...');

    try {
      setTimeout(() => {
        setGenerationStep('Step 2/4: Extracting brand color palette and positioning...');
      }, 700);

      setTimeout(() => {
        setGenerationStep('Step 3/4: Analyzing operational challenges and supervisor bottlenecks...');
      }, 1500);

      setTimeout(() => {
        setGenerationStep('Step 4/4: Grounding factual claims and assembling 10 executive slides...');
      }, 2300);

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      if (!res.ok) {
        let errorMsg = 'Generation failed';
        try {
          const errData = await res.json();
          if (typeof errData?.error === 'string') {
            errorMsg = errData.error;
          } else if (errData?.error && typeof errData.error.message === 'string') {
            errorMsg = errData.error.message;
          } else if (typeof errData?.message === 'string') {
            errorMsg = errData.message;
          } else if (errData) {
            errorMsg = JSON.stringify(errData);
          }
        } catch {
          errorMsg = `Server returned HTTP ${res.status}: ${res.statusText}`;
        }
        throw new Error(errorMsg);
      }

      const newDeck: PresentationDeck = await res.json();
      setDecks((prev) => [newDeck, ...prev]);
      setCurrentDeck(newDeck);
      setActiveSlideIndex(0);
      setIsGeneratorOpen(false);
      setSaveStatus('Auto-saved');
    } catch (err: any) {
      console.error('Deck Generation Error:', err);
      const msg = typeof err === 'string' 
        ? err 
        : typeof err?.message === 'string' 
          ? err.message 
          : 'Could not generate presentation. Please check connection and try again.';
      alert(`Generation Error: ${msg}`);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Save slide edits handler
  const handleSaveSlide = async (updatedSlide: SlideData) => {
    if (!currentDeck) return;

    const updatedSlides = currentDeck.slides.map((s) =>
      s.id === updatedSlide.id ? updatedSlide : s
    );

    const updatedDeck: PresentationDeck = {
      ...currentDeck,
      slides: updatedSlides,
      updatedAt: new Date().toISOString()
    };

    setCurrentDeck(updatedDeck);
    setDecks((prev) => prev.map((d) => (d.id === updatedDeck.id ? updatedDeck : d)));

    try {
      await fetch(`/api/decks/${currentDeck.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDeck)
      });
      setSaveStatus('Slide saved');
    } catch (err) {
      console.error('Failed to sync slide update:', err);
    }
  };

  // Quick layout switcher handler
  const handleUpdateLayout = (layoutType: SlideData['layoutType']) => {
    if (!currentDeck) return;
    const activeSlide = currentDeck.slides[activeSlideIndex];
    if (!activeSlide) return;
    handleSaveSlide({
      ...activeSlide,
      layoutType,
      lastEditedAt: new Date().toISOString()
    });
  };

  // Move slide up or down
  const handleMoveSlide = async (index: number, direction: 'up' | 'down') => {
    if (!currentDeck) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentDeck.slides.length) return;

    const newSlides = [...currentDeck.slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    const total = newSlides.length;
    const renumbered = newSlides.map((s, idx) => ({
      ...s,
      slideNumber: idx + 1,
      headerTag: `${(idx + 1).toString().padStart(2, '0')} / ${total.toString().padStart(2, '0')}`
    }));

    const updatedDeck = { ...currentDeck, slides: renumbered, updatedAt: new Date().toISOString() };
    setCurrentDeck(updatedDeck);
    setActiveSlideIndex(targetIndex);
    setDecks((prev) => prev.map((d) => (d.id === updatedDeck.id ? updatedDeck : d)));

    try {
      await fetch(`/api/decks/${currentDeck.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDeck)
      });
      setSaveStatus('Slide reordered');
    } catch (err) {
      console.error('Failed to sync slide reorder:', err);
    }
  };

  // Duplicate slide
  const handleDuplicateSlide = async (index: number) => {
    if (!currentDeck) return;
    const original = currentDeck.slides[index];
    const duplicate: SlideData = {
      ...JSON.parse(JSON.stringify(original)),
      id: `slide-${Date.now()}`,
      title: `${original.title} (Copy)`,
      version: 1,
      lastEditedAt: new Date().toISOString()
    };

    const newSlides = [...currentDeck.slides];
    newSlides.splice(index + 1, 0, duplicate);

    const total = newSlides.length;
    const renumbered = newSlides.map((s, idx) => ({
      ...s,
      slideNumber: idx + 1,
      headerTag: `${(idx + 1).toString().padStart(2, '0')} / ${total.toString().padStart(2, '0')}`
    }));

    const updatedDeck = { ...currentDeck, slides: renumbered, updatedAt: new Date().toISOString() };
    setCurrentDeck(updatedDeck);
    setActiveSlideIndex(index + 1);
    setDecks((prev) => prev.map((d) => (d.id === updatedDeck.id ? updatedDeck : d)));

    try {
      await fetch(`/api/decks/${currentDeck.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDeck)
      });
      setSaveStatus('Slide duplicated');
    } catch (err) {
      console.error('Failed to sync duplicated slide:', err);
    }
  };

  // Delete slide
  const handleDeleteSlide = async (index: number) => {
    if (!currentDeck || currentDeck.slides.length <= 1) return;
    if (!window.confirm(`Delete Slide ${currentDeck.slides[index].slideNumber}?`)) return;

    const newSlides = currentDeck.slides.filter((_, idx) => idx !== index);
    const total = newSlides.length;
    const renumbered = newSlides.map((s, idx) => ({
      ...s,
      slideNumber: idx + 1,
      headerTag: `${(idx + 1).toString().padStart(2, '0')} / ${total.toString().padStart(2, '0')}`
    }));

    const updatedDeck = { ...currentDeck, slides: renumbered, updatedAt: new Date().toISOString() };
    setCurrentDeck(updatedDeck);
    setActiveSlideIndex(Math.min(activeSlideIndex, renumbered.length - 1));
    setDecks((prev) => prev.map((d) => (d.id === updatedDeck.id ? updatedDeck : d)));

    try {
      await fetch(`/api/decks/${currentDeck.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDeck)
      });
      setSaveStatus('Slide removed');
    } catch (err) {
      console.error('Failed to sync slide deletion:', err);
    }
  };

  // Add slide
  const handleAddSlide = async () => {
    if (!currentDeck) return;
    const newSlideNumber = currentDeck.slides.length + 1;
    const newSlide: SlideData = {
      id: `slide-${Date.now()}`,
      slideNumber: newSlideNumber,
      section: 'personalized',
      headerTag: `${newSlideNumber.toString().padStart(2, '0')} / ${newSlideNumber.toString().padStart(2, '0')}`,
      eyebrow: 'OPERATIONAL VALUE',
      title: 'New Service Strategy',
      subtitle: `Custom tailored operational solution for ${currentDeck.companyName}.`,
      footerNote: 'FocusRealm Service Execution Platform',
      layoutType: 'intro_title',
      cards: [
        { id: `c-${Date.now()}-1`, number: '01', title: 'Operational Objective', description: 'Clear deliverable aligned with hotel standard of care.' },
        { id: `c-${Date.now()}-2`, number: '02', title: 'Execution Process', description: 'Floor workflow carried out on daily shifts with photo proof.' },
        { id: `c-${Date.now()}-3`, number: '03', title: 'Verified Proof', description: 'Audit-ready supervisory verification for property owners.' }
      ]
    };

    const newSlides = [...currentDeck.slides, newSlide];
    const total = newSlides.length;
    const renumbered = newSlides.map((s, idx) => ({
      ...s,
      slideNumber: idx + 1,
      headerTag: `${(idx + 1).toString().padStart(2, '0')} / ${total.toString().padStart(2, '0')}`
    }));

    const updatedDeck = { ...currentDeck, slides: renumbered, updatedAt: new Date().toISOString() };
    setCurrentDeck(updatedDeck);
    setActiveSlideIndex(renumbered.length - 1);
    setDecks((prev) => prev.map((d) => (d.id === updatedDeck.id ? updatedDeck : d)));

    try {
      await fetch(`/api/decks/${currentDeck.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDeck)
      });
      setSaveStatus('New slide added');
    } catch (err) {
      console.error('Failed to sync new slide:', err);
    }
  };

  // Regenerate slide handler
  const handleRegenerateSlide = async (prompt: string) => {
    if (!currentDeck) return;
    const activeSlide = currentDeck.slides[activeSlideIndex];
    if (!activeSlide) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/regenerate-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deckId: currentDeck.id,
          slideId: activeSlide.id,
          prompt
        })
      });

      if (!res.ok) {
        throw new Error('Failed to regenerate slide');
      }

      const { slide: updatedSlide, deck: updatedDeck } = await res.json();

      setCurrentDeck(updatedDeck);
      setDecks((prev) => prev.map((d) => (d.id === updatedDeck.id ? updatedDeck : d)));
      setIsRegenerateOpen(false);
      setSaveStatus('Slide regenerated');
    } catch (err: any) {
      alert(`Regeneration Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Update brand palette handler (both target hotel palette and FocusRealm core theme)
  const handleUpdateBrandPalette = async (updatedTarget: BrandPalette, updatedCore: BrandPalette) => {
    if (!currentDeck) return;

    // Apply target palette to Section 2 slides
    const updatedSlides = currentDeck.slides.map((slide) => {
      if (slide.section === 'personalized') {
        return {
          ...slide,
          customBrandTheme: updatedTarget
        };
      }
      return slide;
    });

    const updatedDeck: PresentationDeck = {
      ...currentDeck,
      slides: updatedSlides,
      theme: {
        focusRealmPalette: updatedCore,
        targetBrandPalette: updatedTarget
      },
      updatedAt: new Date().toISOString()
    };

    setCurrentDeck(updatedDeck);
    setDecks((prev) => prev.map((d) => (d.id === updatedDeck.id ? updatedDeck : d)));

    try {
      await fetch(`/api/decks/${currentDeck.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDeck)
      });
      setSaveStatus('Theme & palette applied');
    } catch (err) {
      console.error('Failed to sync palette update:', err);
    }
  };

  // Delete deck handler
  const handleDeleteDeck = async (deckId: string) => {
    if (!window.confirm('Are you sure you want to delete this presentation?')) return;
    try {
      await fetch(`/api/decks/${deckId}`, { method: 'DELETE' });
      const remaining = decks.filter((d) => d.id !== deckId);
      setDecks(remaining);
      if (currentDeck?.id === deckId) {
        setCurrentDeck(remaining[0] || null);
        setActiveSlideIndex(0);
      }
    } catch (err) {
      console.error('Failed to delete deck:', err);
    }
  };

  // Export PPTX handler with explicit binary Blob
  const handleExportPptx = async (targetDeck?: PresentationDeck) => {
    const deckToExport = targetDeck || currentDeck;
    if (!deckToExport) return;
    setIsExporting(true);
    setExportType('pptx');
    try {
      const res = await fetch('/api/export-pptx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deckToExport)
      });

      if (!res.ok) throw new Error('PPTX export failed on server');

      const arrayBuf = await res.arrayBuffer();
      const blob = new Blob([arrayBuf], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${deckToExport.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_FocusRealm_Deck.pptx`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        a.remove();
      }, 200);
      setSaveStatus('PPTX downloaded');
    } catch (err: any) {
      alert(`Export error: ${err.message}`);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  // Clean, High-Resolution 16:9 PDF Export using backend headless Chromium
  // High-Resolution 16:9 PDF Export rendering all canonical slides
  const handleExportPdf = async (targetDeck?: PresentationDeck) => {
    const deckToExport = targetDeck || currentDeck;
    if (!deckToExport) return;
    setIsExporting(true);
    setExportType('pdf');
    setSaveStatus('Rendering 16:9 Presentation PDF...');
    try {
      const pdfBlob = await exportDeckToPdf(deckToExport, (current, total) => {
        setSaveStatus(`Rendering Slide ${current} of ${total}...`);
      });

      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${deckToExport.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_FocusRealm_Presentation.pdf`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        a.remove();
      }, 500);
      setSaveStatus('PDF downloaded');
    } catch (err: any) {
      console.error('PDF export error:', err);
      alert(`Could not export PDF: ${err?.message || err}`);
      setSaveStatus('PDF export failed');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  if (isLoading) {
    return (
      <FocusRealmLoader 
        title="Focus Realm"
        subtitle="First Call Deck Studio"
        status="Loading presentations & client dossiers..."
      />
    );
  }

  const activeSlide = currentDeck?.slides[activeSlideIndex];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Navbar */}
      <Navbar
        currentDeck={currentDeck}
        decks={decks}
        currentView={currentView}
        onSwitchView={setCurrentView}
        onSelectDeck={(d) => {
          setCurrentDeck(d);
          setActiveSlideIndex(0);
          setCurrentView('studio');
        }}
        onNewDeck={(company?: string) => {
          setPresetCompanyName(company || '');
          setIsGeneratorOpen(true);
        }}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenBrandEditor={() => setIsBrandEditorOpen(true)}
        onOpenSources={() => setIsSourcesDrawerOpen(true)}
        onStartPresenting={() => setIsPresenterOpen(true)}
        onExportPptx={() => handleExportPptx()}
        onExportPdf={() => handleExportPdf()}
        isExporting={isExporting}
        exportType={exportType}
        saveStatus={saveStatus}
      />

      {/* Main Workspace: Either Full Library Dashboard or 16:9 Studio Canvas */}
      {currentView === 'library' ? (
        <DeckLibraryView
          decks={decks}
          activeDeckId={currentDeck?.id || null}
          onSelectDeck={(d) => {
            setCurrentDeck(d);
            setActiveSlideIndex(0);
          }}
          onOpenStudio={() => setCurrentView('studio')}
          onNewDeck={(company?: string) => {
            setPresetCompanyName(company || '');
            setIsGeneratorOpen(true);
          }}
          onDeleteDeck={handleDeleteDeck}
          onExportPptx={handleExportPptx}
          onExportPdf={handleExportPdf}
          onStartPresenting={(d) => {
            setCurrentDeck(d);
            setActiveSlideIndex(0);
            setIsPresenterOpen(true);
          }}
        />
      ) : currentDeck && activeSlide ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Slide Thumbnail Navigator */}
          <SlideThumbnailList
            deck={currentDeck}
            activeSlideIndex={activeSlideIndex}
            onSelectSlide={(idx) => setActiveSlideIndex(idx)}
            onMoveSlide={handleMoveSlide}
            onDuplicateSlide={handleDuplicateSlide}
            onDeleteSlide={handleDeleteSlide}
            onAddSlide={handleAddSlide}
          />

          {/* Center: Interactive 16:9 Slide Canvas */}
          <SlideViewer
            deck={currentDeck}
            slide={activeSlide}
            activeSlideIndex={activeSlideIndex}
            totalSlides={currentDeck.slides.length}
            onPrevSlide={() => setActiveSlideIndex((prev) => Math.max(prev - 1, 0))}
            onNextSlide={() => setActiveSlideIndex((prev) => Math.min(prev + 1, currentDeck.slides.length - 1))}
            onEditSlide={() => setIsSlideEditorOpen(true)}
            onRegenerateSlide={() => setIsRegenerateOpen(true)}
            onOpenSources={() => setIsSourcesDrawerOpen(true)}
            onUpdateLayout={handleUpdateLayout}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-4">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1 font-serif">
            No Active Presentation
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mb-6">
            Generate an executive 10-slide sales presentation tailored to any hotel or management company.
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('library')}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer"
            >
              <span>View All Presentations</span>
            </button>
            <button
              onClick={() => setIsGeneratorOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Generate New Deck</span>
            </button>
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      <GeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => {
          setIsGeneratorOpen(false);
          setPresetCompanyName('');
        }}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        generationStep={generationStep}
        initialCompanyName={presetCompanyName}
      />

      {currentDeck && (
        <>
          <BrandPaletteEditor
            isOpen={isBrandEditorOpen}
            onClose={() => setIsBrandEditorOpen(false)}
            targetPalette={currentDeck.theme.targetBrandPalette}
            corePalette={currentDeck.theme.focusRealmPalette}
            companyName={currentDeck.companyName}
            onUpdatePalettes={handleUpdateBrandPalette}
          />

          <ResearchSourcesDrawer
            isOpen={isSourcesDrawerOpen}
            onClose={() => setIsSourcesDrawerOpen(false)}
            dossier={currentDeck.companyDossier}
          />

          {activeSlide && (
            <>
              <SlideEditorModal
                key={activeSlide.id}
                isOpen={isSlideEditorOpen}
                onClose={() => setIsSlideEditorOpen(false)}
                slide={activeSlide}
                onSaveSlide={handleSaveSlide}
              />

              <RegenerateModal
                key={`regen-${activeSlide.id}`}
                isOpen={isRegenerateOpen}
                onClose={() => setIsRegenerateOpen(false)}
                slide={activeSlide}
                onRegenerate={handleRegenerateSlide}
                isRegenerating={isGenerating}
              />
            </>
          )}

          {isPresenterOpen && (
            <PresenterMode
              deck={currentDeck}
              initialSlideIndex={activeSlideIndex}
              onClose={() => setIsPresenterOpen(false)}
            />
          )}
        </>
      )}

      <DeckHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        decks={decks}
        activeDeckId={currentDeck?.id || null}
        onSelectDeck={(d) => {
          setCurrentDeck(d);
          setActiveSlideIndex(0);
          setCurrentView('studio');
        }}
        onDeleteDeck={handleDeleteDeck}
        onNewDeck={() => {
          setPresetCompanyName('');
          setIsGeneratorOpen(true);
        }}
      />
    </div>
  );
}

export default App;
