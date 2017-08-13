FROM node:8.3.0
WORKDIR /app
ENV PORT=80
EXPOSE 80
COPY dist ./
ENTRYPOINT node server.js
