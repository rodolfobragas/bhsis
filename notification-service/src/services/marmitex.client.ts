import axios from 'axios';

const BASE_URL = process.env.API_CORE_URL || 'http://localhost:4000';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 7000,
});

export interface DeliverySummary {
  id: string;
  motoboyId?: string;
  status: string;
  cliente?: { telefone?: string };
}

export async function getDelivery(id: string) {
  const response = await client.get<DeliverySummary>(`/entregas/${id}`);
  return response.data;
}
