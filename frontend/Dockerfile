FROM node:22-alpine AS build
WORKDIR /build

# На сервере DNS может не резолвить storage.googleapis.com (puppeteer/chromium).
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1 \
    PUPPETEER_SKIP_DOWNLOAD=1

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund --ignore-scripts && npm rebuild esbuild

COPY . .
RUN npm run build

FROM nginx:alpine AS runner

ENV NGINX_PORT=80 \
    BACKEND_HOST=backend \
    BACKEND_PORT=8080

COPY --from=build /build/dist /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
