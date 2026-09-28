# Stage 1: builder
FROM node:23-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate
RUN npm run build

# Stage 2: runtime
FROM node:23-alpine
RUN apk update && apk upgrade --no-cache
RUN npm install -g npm@latest
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN npm ci --omit=dev
RUN npx prisma generate
EXPOSE 3000
USER node
CMD ["npm", "run", "start:prod"]



# * on COPY-Copies both package.json and package-lock.json to the working directory
# .. copies from schema
# env files handles on docker-compose.yml file

