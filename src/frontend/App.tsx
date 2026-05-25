import React, { useState } from 'react';
import { createPlayer } from '../game/cards';
import { startGame, playRound, GameState } from '../game/engine';

const App = () => {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [blobId, setBlobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const handleStartGame = async () => {
    if (!player1Name || !player2Name) return;
    setLoading(true);
    const { state, blobId } = await startGame(player1Name, player2Name, createPlayer);
    setGameState(state);
    setBlobId(blobId);
    setLoading(false);
    setGameOver(false);
  };

  const handlePlayRound = () => {
    if (!gameState || gameOver) return;
    const newState = playRound(gameState);
    setGameState(newState);
    if (newState.winner || newState.currentTurn > 4) setGameOver(true);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', color: '#7c3aed', marginBottom: '10px' }}>🃏 SuiCards</h1>
        <p style={{ color: '#a78bfa', fontSize: '1.1rem', marginBottom: '16px' }}>
          On-Chain Card Battle powered by Walrus & Tatum
        </p>
        <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
          SuiCards is a decentralized card battle game built on the Sui blockchain. 
          Every game state and deck is permanently stored on <strong style={{ color: '#7c3aed' }}>Walrus decentralized storage</strong>, 
          and all blockchain interactions are powered by <strong style={{ color: '#7c3aed' }}>Tatum's enterprise Sui RPC nodes</strong>. 
          No central server. No database. Just pure on-chain gaming. 🚀
        </p>
      </div>

      {/* How it works */}
      {!gameState && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', gap: '12px' }}>
          {[
            { icon: '🎴', title: 'Build Your Deck', desc: 'Get 4 random cards with unique attack and defense stats' },
            { icon: '⚔️', title: 'Battle On-Chain', desc: 'Play rounds against your opponent, card vs card' },
            { icon: '🐋', title: 'Stored on Walrus', desc: 'Every game state is saved to Walrus decentralized storage' },
            { icon: '🏆', title: 'Win & Earn', desc: 'Beat your opponent and claim victory on Sui Mainnet' },
          ].map((item, i) => (
            <div key={i} style={{ background: '#1a1a2e', padding: '16px', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{item.icon}</div>
              <h4 style={{ color: '#a78bfa', marginBottom: '6px', fontSize: '0.85rem' }}>{item.title}</h4>
              <p style={{ color: '#888', fontSize: '0.75rem', lineHeight: '1.4' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Card types */}
      {!gameState && (
        <div style={{ background: '#1a1a2e', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
          <h3 style={{ color: '#a78bfa', marginBottom: '12px' }}>🃏 Card Types</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { type: '🔥 Fire', color: '#ef4444', desc: 'High attack, medium defense' },
              { type: '💧 Water', color: '#3b82f6', desc: 'Balanced attack and defense' },
              { type: '🌍 Earth', color: '#84cc16', desc: 'Low attack, very high defense' },
              { type: '💨 Air', color: '#a78bfa', desc: 'Highest attack, lowest defense' },
            ].map((c, i) => (
              <div key={i} style={{ background: '#0a0a1a', padding: '10px 16px', borderRadius: '8px', borderLeft: `3px solid ${c.color}` }}>
                <p style={{ color: c.color, fontWeight: 'bold', fontSize: '0.85rem' }}>{c.type}</p>
                <p style={{ color: '#888', fontSize: '0.75rem' }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!gameState ? (
        <div style={{ background: '#1a1a2e', padding: '30px', borderRadius: '12px' }}>
          <h2 style={{ marginBottom: '8px' }}>⚔️ Start a New Battle</h2>
          <p style={{ color: '#888', marginBottom: '20px', fontSize: '0.9rem' }}>
            Enter two player names to begin. Each player gets 4 random cards. The player with the most health after all rounds wins!
          </p>
          <input
            type="text"
            placeholder="Player 1 Name"
            value={player1Name}
            onChange={e => setPlayer1Name(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', background: '#0a0a1a', color: '#fff', border: '1px solid #7c3aed' }}
          />
          <input
            type="text"
            placeholder="Player 2 Name"
            value={player2Name}
            onChange={e => setPlayer2Name(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', background: '#0a0a1a', color: '#fff', border: '1px solid #7c3aed' }}
          />
          <button
            onClick={handleStartGame}
            disabled={loading || !player1Name || !player2Name}
            style={{ width: '100%', padding: '14px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', opacity: (!player1Name || !player2Name) ? 0.5 : 1 }}
          >
            {loading ? '🐋 Saving to Walrus...' : '⚔️ Start Battle'}
          </button>
        </div>
      ) : (
        <div>
          {/* Health bars */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '12px' }}>
            {[gameState.player1, gameState.player2].map((p, i) => (
              <div key={i} style={{ background: '#1a1a2e', padding: '20px', borderRadius: '12px', width: '48%' }}>
                <h3 style={{ marginBottom: '8px' }}>{p.name}</h3>
                <p style={{ color: '#ef4444', fontSize: '1.5rem', marginBottom: '4px' }}>❤️ {Math.max(0, p.health)}</p>
                <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '8px' }}>Cards left: {p.deck.length}</p>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {p.deck.map((card, j) => (
                    <span key={j} style={{ background: '#0a0a1a', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', color: '#a78bfa' }}>
                      {card.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Move log */}
          <div style={{ background: '#1a1a2e', padding: '20px', borderRadius: '12px', marginBottom: '20px', minHeight: '100px' }}>
            <h3 style={{ marginBottom: '10px' }}>⚔️ Battle Log</h3>
            {gameState.moves.length === 0 && (
              <p style={{ color: '#888', fontSize: '0.9rem' }}>No rounds played yet. Click Play Next Round to begin!</p>
            )}
            {gameState.moves.map((move, i) => (
              <p key={i} style={{ color: '#ccc', marginBottom: '6px', fontSize: '0.9rem' }}>• {move}</p>
            ))}
          </div>

          {/* Walrus blob ID */}
          {blobId && (
            <div style={{ background: '#1a1a2e', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
              <p style={{ color: '#888', fontSize: '0.75rem', wordBreak: 'break-all' }}>
                🐋 Game saved on Walrus — Blob ID: <span style={{ color: '#7c3aed' }}>{blobId}</span>
              </p>
            </div>
          )}

          {/* Winner */}
          {gameOver && (
            <div style={{ background: '#7c3aed', padding: '20px', borderRadius: '12px', textAlign: 'center', marginBottom: '20px' }}>
              <h2>🏆 {gameState.winner ? `${gameState.winner} Wins!` : "It's a Draw!"}</h2>
              <p style={{ color: '#ddd', marginTop: '8px', fontSize: '0.9rem' }}>Game state permanently stored on Walrus decentralized storage</p>
            </div>
          )}

          {/* Buttons */}
          {!gameOver ? (
            <button
              onClick={handlePlayRound}
              style={{ width: '100%', padding: '14px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}
            >
              ▶️ Play Next Round
            </button>
          ) : (
            <button
              onClick={() => { setGameState(null); setBlobId(null); setGameOver(false); }}
              style={{ width: '100%', padding: '14px', background: '#1a1a2e', color: '#fff', border: '1px solid #7c3aed', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}
            >
              🔄 Play Again
            </button>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '40px', color: '#555', fontSize: '0.8rem' }}>
        <p>Built with ❤️ on Sui Blockchain • Powered by Walrus Storage & Tatum RPC</p>
      </div>
    </div>
  );
};

export default App;
