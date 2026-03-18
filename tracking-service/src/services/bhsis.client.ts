import axios from 'axios';

const BHSIS_BASE_URL = process.env.BHSIS_API_URL || 'http://localhost:3000';
const BHSIS_SERVICE_TOKEN = process.env.BHSIS_SERVICE_TOKEN;

const client = axios.create({
  baseURL: BHSIS_BASE_URL,
  timeout: 5000,
  headers: BHSIS_SERVICE_TOKEN
    ? {
        'x-service-token': BHSIS_SERVICE_TOKEN,
      }
    : undefined,
});

export interface BhsisDeliverySnapshot {
  id: string;
  ordemRota?: number;
  status: string;
}

export interface BhsisPositionPayload {
  latitude: number;
  longitude: number;
  speed?: number;
  timestamp?: string;
  motoboyId?: string;
  status?: string;
}

export async function listDeliveries(motoboyId?: string): Promise<BhsisDeliverySnapshot[]> {
  try {
    const response = await client.get<BhsisDeliverySnapshot[]>('/api/deliveries', {
      params: motoboyId ? { motoboyId } : undefined,
    });
    return response.data;
  } catch (error) {
    console.warn('Falha ao buscar entregas BHSIS', error);
    return [];
  }
}

export async function recordPosition(
  deliveryId: string,
  payload: BhsisPositionPayload,
): Promise<void> {
  try {
    await client.post(`/api/deliveries/${deliveryId}/position`, payload);
  } catch (error) {
    console.warn(`Falha ao registrar posição da entrega ${deliveryId}`, error);
  }
}
