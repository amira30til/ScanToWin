# Frontend Dockerfile - Multi-stage build
FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm cache clean --force

# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ARG VITE_API_BASE_URL
ARG VITE_FRONTEND_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_FRONTEND_URL=$VITE_FRONTEND_URL

RUN npm run build

# Production stage with Nginx
FROM nginx:stable-alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Add health check script
RUN echo '#!/bin/sh' > /healthcheck.sh && \
    echo 'wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1' >> /healthcheck.sh && \
    chmod +x /healthcheck.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD /healthcheck.sh

CMD ["nginx", "-g", "daemon off;"]
