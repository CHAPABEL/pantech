FROM node:latest AS build
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM caddy:2-alpine AS runner
WORKDIR /app
COPY --from=build /build/dist /web
COPY Caddyfile /etc/caddy/Caddyfile
