FROM node:20-bookworm

RUN apt-get update && \
    apt-get install -y build-essential default-jdk python3 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY server/package*.json server/
COPY client/package*.json client/
RUN cd server && npm install --omit=dev
RUN cd client && npm install

COPY . .
RUN cd client && npm run build

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

CMD ["node", "server/src/index.js"]
