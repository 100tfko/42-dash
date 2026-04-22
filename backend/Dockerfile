FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm install
COPY . .
EXPOSE 3000
ENV BACKEND_PORT=3000
CMD ["node", "index.js"]