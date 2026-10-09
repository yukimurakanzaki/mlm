# Production image. Build:  docker build -t pt-mlm .
# Run:  docker run -p 3000:3000 --env-file .env.production.local pt-mlm
# Needs DATABASE_URL, CLERK_SECRET_KEY and NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY at runtime.
FROM node:24-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* values are inlined at build time
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_SENTRY_DISABLED=true \
    NEXT_TELEMETRY_DISABLED=1 \
    CLERK_SECRET_KEY=build_placeholder \
    DATABASE_URL=postgresql://build:build@localhost:5432/build
RUN npx next build

FROM node:24-slim AS run
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY --from=build /app ./
USER node
EXPOSE 3000
# Apply database migrations, then start the server
CMD ["sh", "-c", "npx dotenv -c -- drizzle-kit migrate && npx next start"]
