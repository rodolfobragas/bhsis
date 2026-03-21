# Build stage
FROM node:20-alpine AS builder
ARG DATABASE_URL_AUTH=postgresql://postgres:postgres@localhost:5432/auth_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_FOOD=postgresql://postgres:postgres@localhost:5432/food_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_WEB=postgresql://postgres:postgres@localhost:5432/web_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_AGRO=postgresql://postgres:postgres@localhost:5432/agro_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_SALOES=postgresql://postgres:postgres@localhost:5432/saloes_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_CLINICAS=postgresql://postgres:postgres@localhost:5432/clinicas_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_SHOP=postgresql://postgres:postgres@localhost:5432/shop_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_PET=postgresql://postgres:postgres@localhost:5432/pet_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_WMS=postgresql://postgres:postgres@localhost:5432/wms_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_OFICINAS=postgresql://postgres:postgres@localhost:5432/oficinas_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_ESCOLAS=postgresql://postgres:postgres@localhost:5432/escolas_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_FROTA=postgresql://postgres:postgres@localhost:5432/frota_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_VAREJO=postgresql://postgres:postgres@localhost:5432/varejo_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_IGREJAS=postgresql://postgres:postgres@localhost:5432/igrejas_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_IMOBILIARIAS=postgresql://postgres:postgres@localhost:5432/imobiliarias_db?options=-c%20search_path%3Dbhsis%2Cpublic
ENV DATABASE_URL_AUTH=${DATABASE_URL_AUTH}
ENV DATABASE_URL_FOOD=${DATABASE_URL_FOOD}
ENV DATABASE_URL_WEB=${DATABASE_URL_WEB}
ENV DATABASE_URL_AGRO=${DATABASE_URL_AGRO}
ENV DATABASE_URL_SALOES=${DATABASE_URL_SALOES}
ENV DATABASE_URL_CLINICAS=${DATABASE_URL_CLINICAS}
ENV DATABASE_URL_SHOP=${DATABASE_URL_SHOP}
ENV DATABASE_URL_PET=${DATABASE_URL_PET}
ENV DATABASE_URL_WMS=${DATABASE_URL_WMS}
ENV DATABASE_URL_OFICINAS=${DATABASE_URL_OFICINAS}
ENV DATABASE_URL_ESCOLAS=${DATABASE_URL_ESCOLAS}
ENV DATABASE_URL_FROTA=${DATABASE_URL_FROTA}
ENV DATABASE_URL_VAREJO=${DATABASE_URL_VAREJO}
ENV DATABASE_URL_IGREJAS=${DATABASE_URL_IGREJAS}
ENV DATABASE_URL_IMOBILIARIAS=${DATABASE_URL_IMOBILIARIAS}

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
# Ensure pnpm patched dependencies are available during install
COPY patches ./patches

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma clients (needs schema in place)
RUN pnpm prisma:generate
RUN PRISMA_RELATIVE=$(find node_modules/.pnpm -path '*/node_modules/.prisma' -print -quit) && \
    ln -s "/app/$PRISMA_RELATIVE" node_modules/.prisma

# Build application
RUN pnpm build

# Runtime stage
FROM node:20-alpine
ARG DATABASE_URL_AUTH=postgresql://postgres:postgres@localhost:5432/auth_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_FOOD=postgresql://postgres:postgres@localhost:5432/food_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_WEB=postgresql://postgres:postgres@localhost:5432/web_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_AGRO=postgresql://postgres:postgres@localhost:5432/agro_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_SALOES=postgresql://postgres:postgres@localhost:5432/saloes_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_CLINICAS=postgresql://postgres:postgres@localhost:5432/clinicas_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_SHOP=postgresql://postgres:postgres@localhost:5432/shop_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_PET=postgresql://postgres:postgres@localhost:5432/pet_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_WMS=postgresql://postgres:postgres@localhost:5432/wms_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_OFICINAS=postgresql://postgres:postgres@localhost:5432/oficinas_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_ESCOLAS=postgresql://postgres:postgres@localhost:5432/escolas_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_FROTA=postgresql://postgres:postgres@localhost:5432/frota_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_VAREJO=postgresql://postgres:postgres@localhost:5432/varejo_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_IGREJAS=postgresql://postgres:postgres@localhost:5432/igrejas_db?options=-c%20search_path%3Dbhsis%2Cpublic
ARG DATABASE_URL_IMOBILIARIAS=postgresql://postgres:postgres@localhost:5432/imobiliarias_db?options=-c%20search_path%3Dbhsis%2Cpublic
ENV DATABASE_URL_AUTH=${DATABASE_URL_AUTH}
ENV DATABASE_URL_FOOD=${DATABASE_URL_FOOD}
ENV DATABASE_URL_WEB=${DATABASE_URL_WEB}
ENV DATABASE_URL_AGRO=${DATABASE_URL_AGRO}
ENV DATABASE_URL_SALOES=${DATABASE_URL_SALOES}
ENV DATABASE_URL_CLINICAS=${DATABASE_URL_CLINICAS}
ENV DATABASE_URL_SHOP=${DATABASE_URL_SHOP}
ENV DATABASE_URL_PET=${DATABASE_URL_PET}
ENV DATABASE_URL_WMS=${DATABASE_URL_WMS}
ENV DATABASE_URL_OFICINAS=${DATABASE_URL_OFICINAS}
ENV DATABASE_URL_ESCOLAS=${DATABASE_URL_ESCOLAS}
ENV DATABASE_URL_FROTA=${DATABASE_URL_FROTA}
ENV DATABASE_URL_VAREJO=${DATABASE_URL_VAREJO}
ENV DATABASE_URL_IGREJAS=${DATABASE_URL_IGREJAS}
ENV DATABASE_URL_IMOBILIARIAS=${DATABASE_URL_IMOBILIARIAS}

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
# Ensure pnpm patched dependencies are available during install
COPY patches ./patches

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "dist/index.js"]
