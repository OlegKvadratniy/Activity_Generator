FROM node:slim
WORKDIR /app
COPY package*.json ./
RUN rm -rf package-lock.json node_modules
RUN npm install
COPY . .
RUN npm run build
FROM scratch AS export-stage
COPY --from=builder /app/dist /dist