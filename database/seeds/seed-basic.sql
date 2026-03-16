INSERT INTO motoboys (nome, telefone, device_id_traccar) VALUES
('Carlos Motoboy', '+5511999990001', 'device-carlos'),
('Marina Moto', '+5511999990002', 'device-marina')
ON CONFLICT DO NOTHING;

INSERT INTO clientes (nome, telefone, endereco, latitude, longitude) VALUES
('Padaria Pão Quentinho', '+5511999991010', 'Rua das Palmeiras, 10, Itabirito - MG', -20.51600, -43.75200),
('Restaurante Sabor & Cia', '+5511999992020', 'Av. Belém, 200, Itabirito - MG', -20.52800, -43.74350)
ON CONFLICT DO NOTHING;

INSERT INTO entregas (cliente_id, motoboy_id, latitude, longitude, endereco, status)
SELECT c.id, m.id, c.latitude, c.longitude, c.endereco, 'pendente'
FROM clientes AS c
CROSS JOIN motoboys AS m
WHERE m.nome = 'Carlos Motoboy'
LIMIT 2
ON CONFLICT DO NOTHING;
