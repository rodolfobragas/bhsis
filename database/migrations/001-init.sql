-- Habilita extensoes necessárias
CREATE EXTENSION IF NOT EXISTS postgis;

-- Tabela de motoboys
CREATE TABLE IF NOT EXISTS motoboys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(120) NOT NULL,
  telefone VARCHAR(30) NOT NULL,
  device_id_traccar VARCHAR(128),
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de clientes com geolocalizacao
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(150) NOT NULL,
  telefone VARCHAR(30) NOT NULL,
  endereco TEXT NOT NULL,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  location GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Status possiveis guardados via constraint
CREATE TYPE delivery_status AS ENUM ('pendente', 'na_rota', 'em_entrega', 'entregue', 'cancelado');

-- Tabela de entregas
CREATE TABLE IF NOT EXISTS entregas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  motoboy_id UUID REFERENCES motoboys(id),
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  endereco TEXT NOT NULL,
  status delivery_status NOT NULL DEFAULT 'pendente',
  ordem_rota INTEGER,
  previsao_entrega TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  route_point GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED
);

-- Tabela de rotas
CREATE TABLE IF NOT EXISTS rotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  motoboy_id UUID REFERENCES motoboys(id),
  entregas_ids JSONB NOT NULL DEFAULT '[]',
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de posicoes
CREATE TABLE IF NOT EXISTS posicoes_motoboy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  motoboy_id UUID NOT NULL REFERENCES motoboys(id) ON DELETE CASCADE,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  speed NUMERIC(6, 2),
  capturado_em TIMESTAMPTZ NOT NULL,
  location GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED
);

CREATE INDEX IF NOT EXISTS idx_posicao_motoboy_location ON posicoes_motoboy USING GIST(location);

-- Eventos de entrega
CREATE TABLE IF NOT EXISTS eventos_entrega (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entrega_id UUID NOT NULL REFERENCES entregas(id) ON DELETE CASCADE,
  tipo VARCHAR(60) NOT NULL,
  detalhes JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
