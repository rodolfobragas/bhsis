import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';
const TRACKING_WS_URL = import.meta.env.VITE_TRACKING_URL ?? 'http://localhost:3002';

interface SummaryResponse {
  status: Record<string, number>;
  entregasHoje: number;
  entregasEmAndamento: number;
  tempoMedioEntregaSegundos: number | null;
}

interface DeliverySnapshot {
  id: string;
  ordemRota?: number;
  status: string;
}

interface PositionPayload {
  motoboyId: string;
  latitude: number;
  longitude: number;
  speed?: number;
  timestamp?: string;
  deliveries?: DeliverySnapshot[];
}

const defaultCenter: LatLngExpression = [-23.55052, -46.633308];

function App() {
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [positions, setPositions] = useState<PositionPayload[]>([]);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map>();
  const socketRef = useRef<Socket>();
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    fetch(`${API_URL}/dashboard/resumo`)
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch(() => setSummary(null));
  }, []);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(TRACKING_WS_URL + '/realtime', { transports: ['websocket'] });
      socketRef.current.on('posicao-motoboy', (payload: PositionPayload) => {
        setPositions((prev) => {
          const filtered = prev.filter((pos) => pos.motoboyId !== payload.motoboyId);
          return [...filtered, payload];
        });
      });
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView(defaultCenter, 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapInstance.current);
    }

    if (!mapInstance.current) return;

    positions.forEach((position) => {
      if (!markersRef.current[position.motoboyId]) {
        markersRef.current[position.motoboyId] = L.marker([position.latitude, position.longitude]).addTo(
          mapInstance.current!,
        );
      } else {
        markersRef.current[position.motoboyId].setLatLng([position.latitude, position.longitude]);
      }
    });
  }, [positions]);

  return (
    <div className="page">
      <header>
        <h1>Monitoramento de Entregas</h1>
        <p>Painel em tempo real para motoboys, rotas e métricas.</p>
      </header>

      <section className="metrics">
        <article>
          <h2>Entregas hoje</h2>
          <p>{summary?.entregasHoje ?? '-'}</p>
        </article>
        <article>
          <h2>Entregas em andamento</h2>
          <p>{summary?.entregasEmAndamento ?? '-'}</p>
        </article>
        <article>
          <h2>Tempo médio (s)</h2>
          <p>{summary?.tempoMedioEntregaSegundos ?? '-'}</p>
        </article>
      </section>

      <section className="map-section">
        <div ref={mapRef} className="map" />
        <aside>
          <h3>Status das entregas</h3>
          <ul>
            {summary
              ? Object.entries(summary.status).map(([status, count]) => (
                  <li key={status}>
                    <span>{status}</span>
                    <strong>{count}</strong>
                  </li>
                ))
              : 'Carregando...'}
          </ul>
        </aside>
      </section>

      <section className="tracking-list">
        <h3>Motoboys conectados</h3>
        <ul>
          {positions.map((position) => (
            <li key={position.motoboyId}>
              <strong>{position.motoboyId}</strong>
              <span>
                {position.latitude.toFixed(4)}, {position.longitude.toFixed(4)}
              </span>
              <span>Velocidade: {position.speed ?? 0} km/h</span>
              {position.deliveries?.length ? (
                <ul className="delivery-snapshot">
                  {position.deliveries.map((delivery) => (
                    <li key={delivery.id}>
                      <span>
                        #{delivery.ordemRota ?? '-'} · {delivery.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="hint">Sem entregas ativas</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
