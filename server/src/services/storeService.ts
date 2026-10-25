import fs from 'fs';
import path from 'path';
import { PresentationDeck } from '../types/presentation.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'presentations.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readAll(): PresentationDeck[] {
  try {
    if (!fs.existsSync(STORE_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading presentations store:', err);
    return [];
  }
}

function writeAll(decks: PresentationDeck[]): void {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(decks, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing presentations store:', err);
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
