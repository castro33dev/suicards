import { v4 as uuidv4 } from 'uuid';

export interface Card {
  id: string;
  name: string;
  attack: number;
  defense: number;
  type: 'fire' | 'water' | 'earth' | 'air';
}

export interface Player {
  id: string;
  name: string;
  health: number;
  deck: Card[];
}

// All available cards in the game
export const ALL_CARDS: Card[] = [
  { id: '1', name: 'Fire Dragon', attack: 8, defense: 4, type: 'fire' },
  { id: '2', name: 'Water Serpent', attack: 6, defense: 7, type: 'water' },
  { id: '3', name: 'Earth Golem', attack: 5, defense: 9, type: 'earth' },
  { id: '4', name: 'Air Phoenix', attack: 9, defense: 3, type: 'air' },
  { id: '5', name: 'Flame Warrior', attack: 7, defense: 5, type: 'fire' },
  { id: '6', name: 'Tidal Wave', attack: 6, defense: 6, type: 'water' },
  { id: '7', name: 'Stone Shield', attack: 4, defense: 10, type: 'earth' },
  { id: '8', name: 'Thunder Bolt', attack: 10, defense: 2, type: 'air' },
];

// Create a new player with a random deck of 4 cards
export const createPlayer = (name: string): Player => {
  const shuffled = [...ALL_CARDS].sort(() => Math.random() - 0.5);
  return {
    id: uuidv4(),
    name,
    health: 100,
    deck: shuffled.slice(0, 4),
  };
};
