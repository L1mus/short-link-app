FROM node:24.16.0-alpine AS builder
WORKDIR /app
COPY package*.json ./

ARG VITE_ENVIRONMENT=production
ENV VITE_ENVIRONMENT=$VITE_ENVIRONMENT
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.31.0-alpine3.23-slim
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]