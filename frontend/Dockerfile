# Stage 1: builder
FROM node:23-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

# Stage 2: runtime
FROM node:23-alpine
RUN apk update && apk upgrade --no-cache
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm ci --omit=dev
RUN rm -rf /usr/local/lib/node_modules/npm/node_modules/tar \
           /usr/local/lib/node_modules/npm/node_modules/node-gyp/node_modules/tar \
           /usr/local/lib/node_modules/npm/node_modules/cacache/node_modules/tar
EXPOSE 3001
USER node
CMD ["node_modules/.bin/next", "start"]


# * on COPY-Copies both package.json and package-lock.json to the working directory
# env files handles on docker-compose.yml file
