import axios from 'axios';

const BASE_URL = process.env.BHSIS_API_URL || 'http://localhost:3000';
const SERVICE_TOKEN = process.env.BHSIS_SERVICE_TOKEN;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 7000,
  headers: SERVICE_TOKEN
    ? {
        'x-service-token': SERVICE_TOKEN,
      }
    : undefined,
});

export interface BhsisDeliverySummary {
  id: string;
  status: string;
  ordemRota?: number;
  customer?: {
    phone?: string;
  };
  motoboy?: {
    deviceIdTraccar?: string;
  };
}

export interface DeliveryStatusUpdate {
  status: string;
}

export async function updateDeliveryStatus(deliveryId: string, status: string) {
  const response = await client.patch(`/api/deliveries/${deliveryId}/status`, { status });
  return response.data as BhsisDeliverySummary;
}

export async function listActiveDeliveries(motoboyId?: string) {
  const params = homeFilters(motoboyId);
  const response = await client.get('/api/deliveries', { params });
  return response.data as BhsisDeliverySummary[];
}

function homeFilters(motoboyId?: string) {
  const filters: Record<string, unknown> = {};
  if (motoboyId) filters.motoboyId = motoboyId;
  filters.status = ['NA_ROTA', 'EM_ENTREGA'];
  return filters;
}
