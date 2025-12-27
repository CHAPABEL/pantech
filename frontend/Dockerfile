FROM node:latest AS build
WORKDIR /build

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine AS runner


COPY --from=build /build/dist /usr/share/nginx/html


COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
