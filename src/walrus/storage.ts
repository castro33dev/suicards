import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const PUBLISHER = process.env.WALRUS_PUBLISHER!;
const AGGREGATOR = process.env.WALRUS_AGGREGATOR!;

// Save data to Walrus
export const saveToWalrus = async (data: object) => {
  const response = await axios.put(
    `${PUBLISHER}/v1/blobs`,
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
