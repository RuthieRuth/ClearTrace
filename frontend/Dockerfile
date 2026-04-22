FROM node:23-alpine
WORKDIR /app
COPY package*.json ./ 
RUN npm install
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]


# * on COPY-Copies both package.json and package-lock.json to the working directory
# env files handles on docker-compose.yml file
