import React, { useState, useEffect } from 'react';
import { createPlayer } from '../game/cards';
import { startGame, playRound, GameState } from '../game/engine';
import { getLeaderboard, updateLeaderboard, LeaderboardEntry } from '../game/leaderboard';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import WalletButton from './components/WalletButton';

const PACKAGE_ID = "0xaec6ffd87cbb3230291aa29f944af7d2448c163285c4a9176fcab5ee3c4ccea4";
const LEADERBOARD_ID = "0x77aa34b0c5f58caa0ac1c410b1c13f5597c206454347380c1fca1cfcfa12f3cd";

const App = () => {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [blobId, setBlobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'game' | 'leaderboard'>('game');
  const [lastMove, setLastMove] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  useEffect(() => {
    setLeaderboard(getLeaderboard());
  }, []);

  const handleStartGame = async () => {
    if (!player1Name || !player2Name) return;
    setLoading(true);
    setTxHash(null);
    const { state, blobId } = await startGame(player1Name, player2Name, createPlayer);
    setGameState(state);
    setBlobId(blobId);
    setLoading(false);
    setGameOver(false);
    setLastMove(null);
  };

  const recordOnChain = (winner: string, loser: string, isDraw: boolean) => {
    if (!account) return;
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::leaderboard::record_result`,
        arguments: [
          tx.object(LEADERBOARD_ID),
          tx.pure.vector('u8', Array.from(new TextEncoder().encode(winner))),
          tx.pure.vector('u8', Array.from(new TextEncoder().encode(loser))),
          tx.pure.bool(isDraw),
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => { setTimeout(() => {
            setTxHash(result.digest); }, 500);
          },
          onError: (err) => {
            console.error('On-chain record failed:', err);
          },
        }
      );
    } catch (err) {
      console.error('Transaction build failed:', err);
    }
  };

  const handlePlayRound = () => {
    if (!gameState || gameOver) return;
    const newState = playRound(gameState);
    setGameState(newState);
    setLastMove(newState.moves[newState.moves.length - 1]);
    if (newState.winner || newState.currentTurn > 4) {
      setGameOver(true);
      const updated = updateLeaderboard(
        newState.player1.name,
        newState.player2.name,
        newState.winner
      );
      setLeaderboard(updated);

      if (account) {
        const isDraw = newState.winner === null;
        const winner = newState.winner || newState.player1.name;
        const loser = newState.winner === newState.player1.name
          ? newState.player2.name
          : newState.player1.name;
        recordOnChain(winner, loser, isDraw);
      }
    }
  };

  const typeColors: Record<string, string> = {
    fire: '#ef4444', water: '#3b82f6', earth: '#84cc16', air: '#a78bfa',
  };
  const typeEmojis: Record<string, string> = {
    fire: '🔥', water: '💧', earth: '🌍', air: '💨',
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', color: '#7c3aed', marginBottom: '4px' }}>🃏 SuiCards</h1>
          <p style={{ color: '#a78bfa', fontSize: '0.85rem' }}>On-Chain Card Battle • Walrus + Tatum + Sui Mainnet</p>
        </div>
        <WalletButton />
      </div>

      {/* Wallet banner */}
      {!account && (
        <div style={{ background: '#1a1a2e', border: '1px solid #7c3aed', padding: '14px 20px', borderRadius: '10px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.2rem' }}>💡</span>
          <p style={{ color: '#a78bfa', fontSize: '0.85rem' }}>
            Connect your Sui wallet to record game results on-chain and appear on the Mainnet leaderboard!
          </p>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        {(['game', 'leaderboard'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 28px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontSize: '0.95rem',
              background: activeTab === tab ? '#7c3aed' : '#1a1a2e',
              color: activeTab === tab ? '#fff' : '#888',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
            }}
          >
            {tab === 'game' ? '⚔️ Battle' : '🏆 Leaderboard'}
          </button>
        ))}
      </div>

      {/* Game Tab */}
      {activeTab === 'game' && (
        <div>
          {!gameState ? (
            <div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                {[
                  { icon: '🎴', title: 'Get Cards', desc: '4 random cards each' },
                  { icon: '⚔️', title: 'Battle', desc: 'Card vs card each round' },
                  { icon: '🐋', title: 'Walrus', desc: 'Game saved on-chain' },
                  { icon: '🏆', title: 'Win', desc: 'Result recorded on Sui' },
                ].map((item, i) => (
                  <div key={i} style={{ background: '#1a1a2e', padding: '16px', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{item.icon}</div>
                    <h4 style={{ color: '#a78bfa', marginBottom: '4px', fontSize: '0.8rem' }}>{item.title}</h4>
                    <p style={{ color: '#666', fontSize: '0.72rem' }}>{item.desc}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: '#1a1a2e', padding: '30px', borderRadius: '12px' }}>
                <h2 style={{ marginBottom: '8px', fontSize: '1.2rem' }}>⚔️ Start a New Battle</h2>
                <p style={{ color: '#666', marginBottom: '20px', fontSize: '0.85rem' }}>
                  Enter two player names. Each gets 4 random cards. Most health after all rounds wins!
                  {account && <span style={{ color: '#22c55e' }}> Results will be recorded on Sui Mainnet. ✅</span>}
                </p>
                <input
                  type="text"
                  placeholder="Player 1 Name"
                  value={player1Name}
                  onChange={e => setPlayer1Name(e.target.value)}
                  style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', background: '#0a0a1a', color: '#fff', border: '1px solid #7c3aed', boxSizing: 'border-box' }}
                />
                <input
                  type="text"
                  placeholder="Player 2 Name"
                  value={player2Name}
                  onChange={e => setPlayer2Name(e.target.value)}
                  style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', background: '#0a0a1a', color: '#fff', border: '1px solid #7c3aed', boxSizing: 'border-box' }}
                />
                <button
                  onClick={handleStartGame}
                  disabled={loading || !player1Name || !player2Name}
                  style={{ width: '100%', padding: '14px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', opacity: (!player1Name || !player2Name) ? 0.5 : 1 }}
                >
                  {loading ? '🐋 Saving to Walrus...' : '⚔️ Start Battle'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                {[gameState.player1, gameState.player2].map((p, i) => (
                  <div key={i} style={{ background: '#1a1a2e', padding: '20px', borderRadius: '12px', flex: 1 }}>
                    <h3 style={{ marginBottom: '8px', fontSize: '1rem' }}>{i === 0 ? '🟣' : '🔵'} {p.name}</h3>
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ background: '#0a0a1a', borderRadius: '6px', height: '8px', marginBottom: '4px' }}>
                        <div style={{ background: p.health > 50 ? '#22c55e' : '#ef4444', width: `${Math.max(0, p.health)}%`, height: '100%', borderRadius: '6px', transition: 'width 0.5s' }} />
                      </div>
                      <p style={{ color: '#ccc', fontSize: '0.85rem' }}>❤️ {Math.max(0, p.health)} HP</p>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {p.deck.map((card, j) => (
                        <div key={j} style={{ background: '#0a0a1a', padding: '6px 8px', borderRadius: '6px', borderLeft: `2px solid ${typeColors[card.type]}`, fontSize: '0.7rem' }}>
                          <p style={{ color: typeColors[card.type] }}>{typeEmojis[card.type]} {card.name}</p>
                          <p style={{ color: '#666' }}>ATK {card.attack} | DEF {card.defense}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {lastMove && (
                <div style={{ background: '#2d1b69', padding: '14px 20px', borderRadius: '10px', marginBottom: '16px', borderLeft: '3px solid #7c3aed' }}>
                  <p style={{ color: '#a78bfa', fontSize: '0.9rem' }}>⚡ {lastMove}</p>
                </div>
              )}

              <div style={{ background: '#1a1a2e', padding: '20px', borderRadius: '12px', marginBottom: '16px', minHeight: '80px' }}>
                <h3 style={{ marginBottom: '10px', fontSize: '0.95rem' }}>📜 Battle Log</h3>
                {gameState.moves.length === 0 && (
                  <p style={{ color: '#666', fontSize: '0.85rem' }}>Click Play Round to begin the battle!</p>
                )}
                {gameState.moves.map((move, i) => (
                  <p key={i} style={{ color: i === gameState.moves.length - 1 ? '#ccc' : '#555', marginBottom: '6px', fontSize: '0.85rem' }}>• {move}</p>
                ))}
              </div>

              {blobId && (
                <div style={{ background: '#1a1a2e', padding: '12px 16px', borderRadius: '8px', marginBottom: '12px' }}>
                  <p style={{ color: '#555', fontSize: '0.72rem', wordBreak: 'break-all' }}>
                    🐋 Walrus Blob ID: <span style={{ color: '#7c3aed' }}>{blobId}</span>
                  </p>
                </div>
              )}

              {txHash && (
                <div style={{ background: '#1a1a2e', padding: '12px 16px', borderRadius: '8px', marginBottom: '12px' }}>
                  <p style={{ color: '#555', fontSize: '0.72rem', wordBreak: 'break-all' }}>
                    ✅ Sui Tx: <a href={`https://suiscan.xyz/mainnet/tx/${txHash}`} target="_blank" rel="noreferrer" style={{ color: '#22c55e' }}>{txHash.slice(0, 20)}...</a>
                  </p>
                </div>
              )}

              {gameOver && (
                <div style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', padding: '24px', borderRadius: '12px', textAlign: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                    🏆 {gameState.winner ? `${gameState.winner} Wins!` : "It's a Draw!"}
                  </h2>
                  <p style={{ color: '#ddd', fontSize: '0.85rem' }}>
                    {account ? 'Result recorded on Sui Mainnet! ✅' : 'Connect wallet to record results on-chain!'}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                {!gameOver ? (
                  <button
                    onClick={handlePlayRound}
                    style={{ flex: 1, padding: '14px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}
                  >
                    ▶️ Play Round {gameState.currentTurn}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { setGameState(null); setBlobId(null); setGameOver(false); setLastMove(null); setTxHash(null); }}
                      style={{ flex: 1, padding: '14px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}
                    >
                      🔄 Play Again
                    </button>
                    <button
                      onClick={() => setActiveTab('leaderboard')}
                      style={{ flex: 1, padding: '14px', background: '#1a1a2e', color: '#fff', border: '1px solid #7c3aed', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}
                    >
                      🏆 Leaderboard
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div style={{ background: '#1a1a2e', padding: '30px', borderRadius: '12px' }}>
          <h2 style={{ marginBottom: '6px', fontSize: '1.2rem' }}>🏆 Leaderboard</h2>
          <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '20px' }}>Top players ranked by wins</p>
          {leaderboard.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ fontSize: '2rem', marginBottom: '10px' }}>🃏</p>
              <p style={{ color: '#666' }}>No games played yet. Start a battle!</p>
            </div>
          ) : (
            leaderboard.map((entry, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                background: '#0a0a1a', padding: '16px', borderRadius: '10px', marginBottom: '10px',
                borderLeft: `3px solid ${i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : i === 2 ? '#cd7c2f' : '#7c3aed'}`
              }}>
                <div style={{ fontSize: '1.5rem', width: '32px', textAlign: 'center' }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>{entry.player}</p>
                  <p style={{ color: '#666', fontSize: '0.8rem' }}>{entry.totalGames} games played</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', textAlign: 'center' }}>
                  <div><p style={{ color: '#22c55e', fontWeight: 'bold' }}>{entry.wins}</p><p style={{ color: '#666', fontSize: '0.72rem' }}>Wins</p></div>
                  <div><p style={{ color: '#ef4444', fontWeight: 'bold' }}>{entry.losses}</p><p style={{ color: '#666', fontSize: '0.72rem' }}>Losses</p></div>
                  <div><p style={{ color: '#fbbf24', fontWeight: 'bold' }}>{entry.draws}</p><p style={{ color: '#666', fontSize: '0.72rem' }}>Draws</p></div>
                </div>
              </div>
            ))
          )}
          <button
            onClick={() => setActiveTab('game')}
            style={{ width: '100%', marginTop: '20px', padding: '14px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}
          >
            ⚔️ Start a Battle
          </button>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '30px', color: '#444', fontSize: '0.78rem' }}>
        <p>Built on Sui Blockchain • Walrus Decentralized Storage • Tatum Sui RPC</p>
        <p style={{ marginTop: '4px' }}>Tatum x Walrus Hackathon 2025</p>
      </div>
    </div>
  );
};

export default App;
