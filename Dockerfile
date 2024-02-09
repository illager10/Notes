# Используйте официальный образ Node в качестве базового образа
FROM node:latest as build

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist/ui /usr/share/nginx/html
