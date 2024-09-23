FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache git
# COPY ENV variable
COPY .env ./

# COPY tsconfig.json file
COPY tsconfig.json ./
COPY package.json ./

COPY src ./src

RUN ls -a
RUN npm install
RUN npm run build

EXPOSE 8082

CMD ["npm", "run", "start"]