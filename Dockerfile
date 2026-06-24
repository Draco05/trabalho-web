FROM node:20-alpine

WORKDIR /app

# Copia só o package.json primeiro para aproveitar o cache de camadas
COPY package*.json ./
RUN npm install --omit=dev

# Copia o restante do projeto
COPY . .

EXPOSE 3000

CMD ["node", "src/app.js"]
