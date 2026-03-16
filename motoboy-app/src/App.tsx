import { useEffect, useState } from 'react';
import axios from 'axios';

declare global {
  interface Window {
    io?: (...args: any[]) => any;
  }
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';
const TRACKING_WS_URL = import.meta.env.VITE_TRACKING_URL ?? 'http://localhost:3002';

interface ClienteResumo {
  nome: string;
  telefone: string;
  endereco: string;
}

interface EntregaResumo {
  id: string;
  endereco: string;
  status: string;
  ordemRota?: number;
  latitude: number;
  longitude: number;
  cliente: ClienteResumo;
}

interface DeliverySnapshot {
  id: string;
  ordemRota?: number;
  status: string;
}

function App() {
  const [motoboyId, setMotoboyId] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [deliveries, setDeliveries] = useState<EntregaResumo[]>([]);
  const [loading, setLoading] = useState(false);

  const sortedDeliveries = [...deliveries].sort((a, b) => (a.ordemRota ?? 0) - (b.ordemRota ?? 0));

  useEffect(() => {
    if (!isLogged) return;
    setLoading(true);
    axios
      .get<EntregaResumo[]>(`${API_URL}/entregas`)
      .then((res) => setDeliveries(res.data))
      .finally(() => setLoading(false));
  }, [isLogged]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (!isLogged || !motoboyId || typeof window.io !== 'function') return;

    const socket = window.io!(TRACKING_WS_URL + '/realtime', { transports: ['websocket'] });
    const handlePosition = (payload: { motoboyId: string; deliveries?: DeliverySnapshot[] }) => {
      if (payload.motoboyId !== motoboyId) return;
      if (!payload.deliveries?.length) return;

      setDeliveries((prev) =>
        prev.map((entrega) => {
          const updated = payload.deliveries?.find((d) => d.id === entrega.id);
          return updated
            ? { ...entrega, status: updated.status, ordemRota: updated.ordemRota ?? entrega.ordemRota }
            : entrega;
        }),
      );
    };

    socket.on('posicao-motoboy', handlePosition);

    return () => {
      socket.off('posicao-motoboy', handlePosition);
      socket.disconnect();
    };
  }, [isLogged, motoboyId]);

  const handleLogin = () => {
    if (!motoboyId) return;
    setIsLogged(true);
  };

  const updateStatusLocally = (id: string, status: string) => {
    setDeliveries((prev) => prev.map((entrega) => (entrega.id === id ? { ...entrega, status } : entrega)));
  };

  const openNavigation = (lat: number, lon: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
  };

  return (
    <div className="app-shell">
      <header>
        <h1>App do Motoboy</h1>
        <p>Controle o fluxo das suas entregas e atualize o status em segundos.</p>
      </header>

      {!isLogged && (
        <section className="login-card">
          <label>
            Motoboy ID
            <input value={motoboyId} onChange={(event) => setMotoboyId(event.target.value)} />
          </label>
          <button onClick={handleLogin} disabled={!motoboyId}>
            Entrar
          </button>
        </section>
      )}

      {isLogged && (
        <section>
          <div className="striped">
            <span>Motoboy: {motoboyId}</span>
            <span>Entregas disponíveis: {deliveries.length}</span>
          </div>

          {loading && <p className="hint">Carregando entregas...</p>}

          <ul className="delivery-list">
            {sortedDeliveries.map((entrega) => (
              <li key={entrega.id}>
                <div>
                  <strong>#{entrega.ordemRota ?? '-'}</strong>
                  <p>{entrega.endereco}</p>
                  <p>Cliente: {entrega.cliente.nome}</p>
                  <p>Status atual: {entrega.status}</p>
                </div>
                <div className="buttons">
                  <button
                    onClick={() => updateStatusLocally(entrega.id, 'em_entrega')}
                    className="primary"
                  >
                    INICIAR ENTREGA
                  </button>
                  <button
                    onClick={() => updateStatusLocally(entrega.id, 'entregue')}
                    className="success"
                  >
                    ENTREGA CONCLUÍDA
                  </button>
                  <button onClick={() => openNavigation(entrega.latitude, entrega.longitude)}>
                    Navegar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default App;
