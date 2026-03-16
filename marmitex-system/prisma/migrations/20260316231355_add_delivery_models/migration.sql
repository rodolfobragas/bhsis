-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDENTE', 'NA_ROTA', 'EM_ENTREGA', 'ENTREGUE', 'CANCELADO');

-- CreateTable
CREATE TABLE "Motoboy" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "device_id_traccar" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Motoboy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" TEXT NOT NULL,
    "order_id" TEXT,
    "customer_id" TEXT,
    "motoboy_id" TEXT,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "endereco" TEXT NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDENTE',
    "ordem_rota" INTEGER,
    "previsao_entrega" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventoEntrega" (
    "id" TEXT NOT NULL,
    "entrega_id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "detalhes" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventoEntrega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PosicaoMotoboy" (
    "id" TEXT NOT NULL,
    "motoboy_id" TEXT NOT NULL,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "speed" DECIMAL(6,2),
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PosicaoMotoboy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rota" (
    "id" TEXT NOT NULL,
    "motoboy_id" TEXT NOT NULL,
    "entregas_ids" JSONB NOT NULL DEFAULT '[]',
    "entregas" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rota_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_motoboy_id_fkey" FOREIGN KEY ("motoboy_id") REFERENCES "Motoboy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoEntrega" ADD CONSTRAINT "EventoEntrega_entrega_id_fkey" FOREIGN KEY ("entrega_id") REFERENCES "Delivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosicaoMotoboy" ADD CONSTRAINT "PosicaoMotoboy_motoboy_id_fkey" FOREIGN KEY ("motoboy_id") REFERENCES "Motoboy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rota" ADD CONSTRAINT "Rota_motoboy_id_fkey" FOREIGN KEY ("motoboy_id") REFERENCES "Motoboy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
