import axios from 'axios';

const BASE_URL = process.env.MARMITEX_API_URL || 'http://localhost:3000';
const SERVICE_TOKEN = process.env.MARMITEX_SERVICE_TOKEN;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 7000,
  headers: SERVICE_TOKEN
    ? {
        'x-service-token': SERVICE_TOKEN,
      }
    : undefined,
});

export interface DeliverySummary {
  id: string;
  motoboyId?: string;
  status: string;
  customer?: { phone?: string };
}

export async function getDelivery(id: string) {
  const response = await client.get<DeliverySummary>(`/api/deliveries/${id}`);
  return response.data;
}
