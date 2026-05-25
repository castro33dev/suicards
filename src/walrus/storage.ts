import axios from 'axios';

const PUBLISHER = 'https://walrus-testnet-publisher.nodes.guru';
const AGGREGATOR = 'https://walrus-testnet-aggregator.nodes.guru';

// Save data to Walrus
export const saveToWalrus = async (data: object) => {
  const response = await axios.put(
    `${PUBLISHER}/v1/blobs?epochs=2`,
    JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
  return response.data.newlyCreated?.blobObject?.blobId || 
         response.data.alreadyCertified?.blobId;
};

// Read data from Walrus
export const readFromWalrus = async (blobId: string) => {
  const response = await axios.get(`${AGGREGATOR}/v1/blobs/${blobId}`);
  return response.data;
};
