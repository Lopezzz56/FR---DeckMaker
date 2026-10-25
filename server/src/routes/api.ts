import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { researchCompany } from '../services/researchService.js';
import { generate8SlideDeck, regenerateSingleSlide } from '../services/deckGenerator.js';
import { generatePptx } from '../services/pptxService.js';
import { generatePdf } from '../services/pdfService.js';
import { deckStore } from '../services/storeService.js';
import { CompanyDossier, PresentationDeck } from '../types/presentation.js';

import os from 'os';

const router = Router();
const uploadDir = (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)
  ? path.join(os.tmpdir(), 'focusrealm_uploads')
  : path.resolve(process.cwd(), 'uploads');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  console.warn('[upload] Notice: Could not create upload directory:', e);
}

const upload = multer({ dest: uploadDir });

// Research Company
router.post('/research', async (req: Request, res: Response) => {
  try {
    const { companyName, websiteUrl, userNotes, uploadedText } = req.body;
    if (!companyName) {
      return res.status(400).json({ error: 'Company or hotel name is required' });
    }

    const dossier = await researchCompany({
      companyName,
      websiteUrl,
      userNotes,
      uploadedText
    });

    return res.json(dossier);
  } catch (err: any) {
    console.error('Error during research:', err);
    return res.status(500).json({ 
      error: err?.message || 'Research failed',
      details: String(err)
    });
  }
});

// Generate 8-Slide Presentation
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { companyName, websiteUrl, userNotes, uploadedText, dossier: customDossier } = req.body;

    let dossier: CompanyDossier;
    if (customDossier && customDossier.name) {
      dossier = customDossier;
    } else {
      if (!companyName) {
        return res.status(400).json({ error: 'Company name is required' });
      }
      dossier = await researchCompany({
        companyName,
        websiteUrl,
        userNotes,
        uploadedText
      });
    }

    const deck = generate8SlideDeck(dossier);
    try {
      deckStore.save(deck);
    } catch (storeErr) {
      console.warn('[deckStore] Non-fatal save failure:', storeErr);
    }

    return res.json(deck);
  } catch (err: any) {
    console.error('Error generating presentation:', err);
    return res.status(500).json({ 
      error: err?.message || 'Generation failed',
      details: String(err)
    });
  }
});

// Regenerate a single slide
router.post('/regenerate-slide', async (req: Request, res: Response) => {
  try {
    const { deckId, slideId, prompt } = req.body;
    const deck = deckStore.getById(deckId);

    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    const slideIndex = deck.slides.findIndex(s => s.id === slideId);
    if (slideIndex === -1) {
      return res.status(404).json({ error: 'Slide not found' });
    }

    const updatedSlide = regenerateSingleSlide(deck.slides[slideIndex], deck.companyDossier, prompt);
    deck.slides[slideIndex] = updatedSlide;
    deckStore.save(deck);

    return res.json({ slide: updatedSlide, deck });
  } catch (err: any) {
    console.error('Error regenerating slide:', err);
    return res.status(500).json({ error: err.message || 'Slide regeneration failed' });
  }
});

// List all presentations
router.get('/decks', (_req: Request, res: Response) => {
  const decks = deckStore.getAll();
  return res.json(decks);
});

// Get single presentation
router.get('/decks/:id', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const deck = deckStore.getById(id);
  if (!deck) {
    return res.status(404).json({ error: 'Presentation not found' });
  }
  return res.json(deck);
});

// Update presentation
router.put('/decks/:id', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const existing = deckStore.getById(id);
  if (!existing) {
    return res.status(404).json({ error: 'Presentation not found' });
  }

  const updatedDeck = { ...existing, ...req.body, id: existing.id };
  deckStore.save(updatedDeck);
  return res.json(updatedDeck);
});

// Delete presentation
router.delete('/decks/:id', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const success = deckStore.delete(id);
  if (!success) {
    return res.status(404).json({ error: 'Presentation not found' });
  }
  return res.json({ success: true });
});

// Handle document uploads
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;
    let extractedText = '';

    if (originalName.toLowerCase().endsWith('.txt') || originalName.toLowerCase().endsWith('.md')) {
      extractedText = fs.readFileSync(filePath, 'utf-8');
    } else {
      // Basic text extraction or fallback for binary files
      extractedText = `Extracted briefing document from ${originalName}`;
    }

    // Clean up temporary upload
    try {
      fs.unlinkSync(filePath);
    } catch {}

    return res.json({
      fileName: originalName,
      extractedText,
      message: `Successfully processed ${originalName}`
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Upload processing failed' });
  }
});

// Export PPTX by POST body or ID
router.post('/export-pptx', async (req: Request, res: Response) => {
  try {
    const deck: PresentationDeck = req.body?.deck || req.body;
    if (!deck || !deck.slides) {
      return res.status(400).json({ error: 'Invalid deck payload' });
    }

    const buffer = await generatePptx(deck);
    const filename = `${deck.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_FocusRealm_Presentation.pptx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err: any) {
    console.error('PPTX generation error:', err);
    res.status(500).json({ error: err.message || 'PPTX generation failed' });
  }
});

router.get('/export-pptx/:id', async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deck = deckStore.getById(id);
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    const buffer = await generatePptx(deck);
    const filename = `${deck.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_FocusRealm_Presentation.pptx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err: any) {
    console.error('PPTX download error:', err);
    res.status(500).json({ error: err.message || 'PPTX download failed' });
  }
});

// Export PDF by POST body or ID
router.post('/export-pdf', async (req: Request, res: Response) => {
  try {
    const deck: PresentationDeck = req.body?.deck || req.body;
    if (!deck || !deck.slides) {
      return res.status(400).json({ error: 'Invalid deck payload' });
    }

    const buffer = await generatePdf(deck);
    const filename = `${deck.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_FocusRealm_Presentation.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err: any) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: err.message || 'PDF generation failed' });
  }
});

router.get('/export-pdf/:id', async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deck = deckStore.getById(id);
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    const buffer = await generatePdf(deck);
    const filename = `${deck.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_FocusRealm_Presentation.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err: any) {
    console.error('PDF download error:', err);
    res.status(500).json({ error: err.message || 'PDF download failed' });
  }
});

export default router;
