import React from 'react';
import {
  useCurrentAccount,
  useConnectWallet,
  useDisconnectWallet,
  useWallets,
} from '@mysten/dapp-kit';

const WalletButton = () => {
  const account = useCurrentAccount();
  const { mutate: connect } = useConnectWallet();
  const { mutate: disconnect } = useDisconnectWallet();
  const wallets = useWallets();

  if (account) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          background: '#1a1a2e',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '0.8rem',
          color: '#a78bfa',
          border: '1px solid #7c3aed'
        }}>
          🟢 {account.address.slice(0, 6)}...{account.address.slice(-4)}
        </div>
        <button
          onClick={() => disconnect()}
          style={{
            padding: '8px 16px',
            background: '#1a1a2e',
            color: '#ef4444',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.8rem',
          }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        if (wallets.length > 0) {
          connect({ wallet: wallets[0] });
        } else {
          window.open('https://suiwallet.com', '_blank');
        }
      }}
      style={{
        padding: '10px 20px',
        background: '#7c3aed',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: 'bold',
      }}
    >
      🔗 Connect Wallet
    </button>
  );
};

export default WalletButton;
