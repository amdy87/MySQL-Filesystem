FROM node:latest

ARG MYFILESYSTEM_BACKEND_HOST

ENV MYFILESYSTEM_BACKEND_HOST ${MYFILESYSTEM_BACKEND_HOST}

WORKDIR /app

COPY package.json package-lock.json vite.config.js index.html .
RUN npm install

CMD npm run dev
