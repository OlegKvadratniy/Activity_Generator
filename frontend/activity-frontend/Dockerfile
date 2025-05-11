FROM node:slim AS builder
WORKDIR /app
COPY package*.json ./
RUN rm -rf package-lock.json node_modules
RUN npm install
COPY . .
RUN npm run build

FROM alpine AS export-stage
RUN apk add --no-cache tini
COPY --from=builder /app/dist /dist
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["tail", "-f", "/dev/null"]