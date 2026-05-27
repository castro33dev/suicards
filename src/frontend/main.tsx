import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mysten/dapp-kit/dist/index.css';

const queryClient = new QueryClient();

const IS_DEV = import.meta.env.DEV;

const networks = {
  mainnet: { 
    url: IS_DEV 
      ? '/sui-rpc' 
      : 'https://sui-mainnet.gateway.tatum.io'
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="mainnet">
        <WalletProvider autoConnect>
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
