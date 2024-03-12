FROM node:20
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .

ENV DATABASE_URL=mysql://root:password@db:3306/db
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/entrypoint.js"]
