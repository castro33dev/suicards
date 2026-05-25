import { createPlayer } from '../src/game/cards';
import { startGame, playRound } from '../src/game/engine';
import { readFromWalrus } from '../src/walrus/storage';
import { suiRPC } from '../src/tatum/rpc';

const main = async () => {
  console.log('🃏 Starting SuiCards test...\n');

  // Test 1: Create players
  console.log('1️⃣ Creating players...');
  const p1 = createPlayer('Alice');
  const p2 = createPlayer('Bob');
  console.log(`✅ ${p1.name} created with ${p1.deck.length} cards`);
  console.log(`✅ ${p2.name} created with ${p2.deck.length} cards\n`);

  // Test 2: Start game and save to Walrus
  console.log('2️⃣ Starting game and saving to Walrus...');
  const { state, blobId } = await startGame('Alice', 'Bob', createPlayer);
  console.log(`✅ Game started! ID: ${state.gameId}`);
  console.log(`✅ Saved to Walrus! Blob ID: ${blobId}\n`);

  // Test 3: Play rounds
  console.log('3️⃣ Playing rounds...');
  let currentState = state;
  while (!currentState.winner && currentState.currentTurn <= 4) {
    currentState = playRound(currentState);
    console.log(currentState.moves[currentState.moves.length - 1]);
  }
  console.log(`\n🏆 Winner: ${currentState.winner || 'Draw'}\n`);

  // Test 4: Read game state from Walrus
  console.log('4️⃣ Reading game state from Walrus...');
  const savedState = await readFromWalrus(blobId);
  console.log(`✅ Retrieved game ID: ${savedState.gameId}\n`);

  // Test 5: Test Tatum RPC
  console.log('5️⃣ Testing Tatum Sui RPC...');
  const chainId = await suiRPC('sui_getChainIdentifier', []);
  console.log(`✅ Connected to Sui chain: ${chainId}\n`);

  console.log('🎉 All tests passed!');
};

main().catch(console.error);
