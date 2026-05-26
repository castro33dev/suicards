export interface LeaderboardEntry {
  player: string;
  wins: number;
  losses: number;
  draws: number;
  totalGames: number;
}

const LEADERBOARD_KEY = 'suicards_leaderboard';

// Get leaderboard from localStorage
export const getLeaderboard = (): LeaderboardEntry[] => {
  const data = localStorage.getItem(LEADERBOARD_KEY);
  if (!data) return [];
  return JSON.parse(data);
};

// Update leaderboard after a game
export const updateLeaderboard = (
  player1: string,
  player2: string,
  winner: string | null
) => {
  const board = getLeaderboard();

  const update = (name: string, result: 'win' | 'loss' | 'draw') => {
    const existing = board.find(e => e.player === name);
    if (existing) {
      existing.totalGames++;
      if (result === 'win') existing.wins++;
      if (result === 'loss') existing.losses++;
      if (result === 'draw') existing.draws++;
    } else {
      board.push({
        player: name,
        wins: result === 'win' ? 1 : 0,
        losses: result === 'loss' ? 1 : 0,
        draws: result === 'draw' ? 1 : 0,
        totalGames: 1,
      });
    }
  };

  if (winner === null) {
    update(player1, 'draw');
    update(player2, 'draw');
  } else {
    update(winner, 'win');
    update(winner === player1 ? player2 : player1, 'loss');
  }

  // Sort by wins
  board.sort((a, b) => b.wins - a.wins);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board));
  return board;
};
