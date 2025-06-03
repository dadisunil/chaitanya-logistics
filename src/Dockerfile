# Frontend Dockerfile for React (Vite)
FROM node:20.11.1 AS build
WORKDIR /app
# Copy package.json and lock file from parent directory
COPY package.json package-lock.json* ./
# Copy vite and config files if needed
COPY vite.config.ts tsconfig*.json tailwind.config.js postcss.config.js eslint.config.js index.html ./
# Copy frontend source code
COPY . .
RUN npm install && npm run build
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf