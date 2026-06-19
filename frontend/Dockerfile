FROM node:22-alpine AS build
WORKDIR /build

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1 \
    PUPPETEER_SKIP_DOWNLOAD=1

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund --ignore-scripts && npm rebuild esbuild

COPY . .
RUN npm run build

FROM nginx:alpine AS runner

COPY --from=build /build/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
