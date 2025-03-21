## Dockerfile for cloud environment
FROM node:20-alpine3.20 AS dependencies

WORKDIR /app
RUN npm install -g pnpm
# COPY pnpm-lock.yaml ./
COPY package.json ./
RUN pnpm --filter sd-jwt-jades install
RUN pnpm install


FROM node:20-alpine3.20 AS build

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm install -g pnpm
RUN pnpm --filter sd-jwt-jades run build
RUN pnpm build

FROM node:20-alpine3.20 AS deploy

WORKDIR /app

ENV NODE_ENV production

COPY --from=build /app/public/ ./public/
COPY --from=build /app/package.json ./
COPY --from=build /app/.next/ ./.next/
COPY --from=build /app/next.config.mjs ./
COPY --from=build /app/node_modules/ ./node_modules/

EXPOSE 3000

ENV PORT 3000

CMD ["pnpm", "start"]