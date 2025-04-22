FROM node:slim
WORKDIR /app
COPY package*.json ./
RUN rm -rf package-lock.json node_modules
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "5173"]