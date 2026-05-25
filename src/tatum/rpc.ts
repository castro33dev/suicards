import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const TATUM_API_KEY = process.env.TATUM_API_KEY!;
const SUI_RPC_URL = process.env.SUI_RPC_URL!;

export const suiRPC = async (method: string, params: any[]) => {
  const response = await axios.post(
    SUI_RPC_URL,
    {
      jsonrpc: '2.0',
      id: 1,
      method,
      params,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TATUM_API_KEY,
      },
    }
  );
  return response.data.result;
};
