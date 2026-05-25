import { Player, Card } from './cards';
import { saveToWalrus } from '../walrus/storage';
import { v4 as uuidv4 } from 'uuid';

export interface GameState {
  gameId: string;
  player1: Player;
  player2: Player;
  currentTurn: number;
  winner: string | null;
  moves: string[];
}

// Calculate damage between two cards
const calculateDamage = (attacker: Card, defender: Card): number => {
  const base = attacker.attack - defender.defense / 2;
  return Math.max(1, Math.round(base));
};

// Play one round
export const playRound = (state: GameState): GameState => {
  const { player1, player2 } = state;

  if (!player1.deck.length || !player2.deck.length) {
    return state;
  }

  const card1 = player1.deck[0];
  const card2 = player2.deck[0];

  const damage1 = calculateDamage(card1, card2);
  const damage2 = calculateDamage(card2, card1);

  player2.health -= damage1;
  player1.health -= damage2;

  const move = `Turn ${state.currentTurn}: ${card1.name} vs ${card2.name} | ${player1.name} deals ${damage1}, ${player2.name} deals ${damage2}`;

  // Remove used cards
  player1.deck.shift();
  player2.deck.shift();

  const winner =
    player1.health <= 0
      ? player2.name
      : player2.health <= 0
      ? player1.name
      : null;

  return {
    ...state,
    player1,
    player2,
    currentTurn: state.currentTurn + 1,
    winner,
    moves: [...state.moves, move],
  };
};

// Start a new game and save to Walrus
export const startGame = async (
  player1Name: string,
  player2Name: string,
  createPlayer: (name: string) => Player
): Promise<{ state: GameState; blobId: string }> => {
  const state: GameState = {
    gameId: uuidv4(),
    player1: createPlayer(player1Name),
    player2: createPlayer(player2Name),
    currentTurn: 1,
    winner: null,
    moves: [],
  };

  const blobId = await saveToWalrus(state);
  return { state, blobId };
};
