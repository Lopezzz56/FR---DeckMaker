import fs from 'fs';
import path from 'path';
import os from 'os';
import { PresentationDeck } from '../types/presentation.js';

// Determine safe storage directory: prefer /tmp in serverless environments, otherwise local data directory
const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const DATA_DIR = isServerless 
  ? path.join(os.tmpdir(), 'focusrealm_data') 
  : path.resolve(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'presentations.json');

// In-memory cache ensures zero crashes even if the filesystem is completely read-only
let memoryDecks: PresentationDeck[] = [];

// Safely ensure directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('[storeService] Notice: File system write unavailable or restricted, utilizing in-memory storage:', err);
}

function readAll(): PresentationDeck[] {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const loaded: PresentationDeck[] = JSON.parse(raw);
      if (Array.isArray(loaded) && loaded.length > 0) {
        memoryDecks = loaded;
      }
    }
  } catch (err) {
    console.warn('[storeService] Notice: Could not read store file, falling back to in-memory store:', err);
  }
  return memoryDecks;
}

function writeAll(decks: PresentationDeck[]): void {
  memoryDecks = decks;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(decks, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[storeService] Notice: Could not persist store file to disk (continuing in-memory):', err);
  }
}

export const deckStore = {
  getAll(): PresentationDeck[] {
    return readAll().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  getById(id: string): PresentationDeck | undefined {
    return readAll().find(d => d.id === id);
  },

  save(deck: PresentationDeck): PresentationDeck {
    const decks = readAll();
    const existingIndex = decks.findIndex(d => d.id === deck.id);
    deck.updatedAt = new Date().toISOString();

    if (existingIndex >= 0) {
      decks[existingIndex] = deck;
    } else {
      decks.unshift(deck);
    }

    writeAll(decks);
    return deck;
  },

  delete(id: string): boolean {
    const decks = readAll();
    const filtered = decks.filter(d => d.id !== id);
    if (filtered.length !== decks.length) {
      writeAll(filtered);
      return true;
    }
    return false;
  }
};

