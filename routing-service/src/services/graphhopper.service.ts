import axios, { AxiosError } from 'axios';

interface GraphhopperRequest {
  vehicles?: Array<{
    start_address?: { lat: number; lon: number };
  }>;
  shipments?: Array<{
    shipment_id: string;
    address: { lat: number; lon: number };
  }>;
  configuration?: Record<string, unknown>;
}

export class GraphhopperService {
  private readonly url: string;
  private readonly baseUrl: string;

  constructor(url: string) {
    this.url = url;
    let origin = url;
    try {
      const parsed = new URL(url);
      origin = `${parsed.protocol}//${parsed.host}`;
    } catch {
      // fallback to provided url
    }
    this.baseUrl = origin;
  }

  async optimizeRoute(payload: GraphhopperRequest) {
    try {
      const response = await axios.post(this.url, payload);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return this.createFallbackSolution(payload);
      }
      throw error;
    }
  }

  private async computeDistance(
    from: { lat: number; lon: number },
    to: { lat: number; lon: number },
  ) {
    try {
      const params = new URLSearchParams();
      params.append('point', `${from.lat},${from.lon}`);
      params.append('point', `${to.lat},${to.lon}`);
      params.append('vehicle', 'car');
      params.append('instructions', 'false');
      params.append('calc_points', 'false');
      const response = await axios.get(`${this.baseUrl}/route`, {
        params,
      });
      return response.data?.paths?.[0]?.distance ?? Number.MAX_VALUE;
    } catch {
      return Number.MAX_VALUE;
    }
  }

  private async createFallbackSolution(payload: GraphhopperRequest) {
    const shipments = payload.shipments ?? [];
    if (!shipments.length) {
      throw new Error('Nenhuma shipment informada para fallback');
    }

    const vehicleStart = payload.vehicles?.[0]?.start_address;
    const startAddress =
      vehicleStart ?? shipments[0].address ?? { lat: 0, lon: 0 };

    const ordered: typeof shipments = [];
    const remaining = [...shipments];
    let currentPoint = {
      lat: Number(startAddress.lat),
      lon: Number(startAddress.lon),
    };

    while (remaining.length) {
      let bestIndex = 0;
      let bestDistance = Number.MAX_VALUE;
      for (let i = 0; i < remaining.length; i++) {
        const candidate = remaining[i];
        const target = {
          lat: Number(candidate.address.lat),
          lon: Number(candidate.address.lon),
        };
        const distance = await this.computeDistance(currentPoint, target);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = i;
        }
      }
      const [next] = remaining.splice(bestIndex, 1);
      ordered.push(next);
      currentPoint = {
        lat: Number(next.address.lat),
        lon: Number(next.address.lon),
      };
    }

    const activities = ordered.map((shipment) => ({
      type: 'service',
      shipment_id: shipment.shipment_id,
    }));

    return {
      solution: {
        routes: [
          {
            activities,
          },
        ],
      },
    };
  }
}
