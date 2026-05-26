import axios from 'axios';

const IS_DEV = import.meta.env.DEV;

const PUBLISHER = IS_DEV 
  ? '/walrus-publisher'
  : 'https://publisher.walrus-testnet.walrus.space';

const AGGREGATOR = IS_DEV
  ? '/walrus-aggregator'  
  : 'https://aggregator.walrus-testnet.walrus.space';

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
