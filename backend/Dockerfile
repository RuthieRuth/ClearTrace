FROM node:23-alpine
WORKDIR /app
COPY package*.json ./ 
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]


# * on COPY-Copies both package.json and package-lock.json to the working directory
# .. copies from schema
# env files handles on docker-compose.yml file

