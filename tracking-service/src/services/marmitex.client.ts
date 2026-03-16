import axios from 'axios';

const MARMITEX_BASE_URL = process.env.MARMITEX_API_URL || 'http://localhost:3000';
const MARMITEX_SERVICE_TOKEN = process.env.MARMITEX_SERVICE_TOKEN;

const client = axios.create({
  baseURL: MARMITEX_BASE_URL,
  timeout: 5000,
  headers: MARMITEX_SERVICE_TOKEN
    ? {
        'x-service-token': MARMITEX_SERVICE_TOKEN,
      }
    : undefined,
});

export interface MarmitexDeliverySnapshot {
  id: string;
  ordemRota?: number;
  status: string;
}

export interface MarmitexPositionPayload {
  latitude: number;
  longitude: number;
  speed?: number;
  timestamp?: string;
  motoboyId?: string;
  status?: string;
}

export async function listDeliveries(motoboyId?: string): Promise<MarmitexDeliverySnapshot[]> {
  try {
    const response = await client.get<MarmitexDeliverySnapshot[]>('/api/deliveries', {
      params: motoboyId ? { motoboyId } : undefined,
    });
    return response.data;
  } catch (error) {
    console.warn('Falha ao buscar entregas Marmitex', error);
    return [];
  }
}

export async function recordPosition(
  deliveryId: string,
  payload: MarmitexPositionPayload,
): Promise<void> {
  try {
    await client.post(`/api/deliveries/${deliveryId}/position`, payload);
  } catch (error) {
    console.warn(`Falha ao registrar posição da entrega ${deliveryId}`, error);
  }
}
