FROM node:20-alpine AS build

WORKDIR /app

COPY ../../package.json ../../package-lock.json ./
COPY ../../packages ./packages
COPY . .

RUN npm install
RUN npm run build --workspace=oxymore-app

# Étape 2 : Runtime léger (optionnel pour static)
FROM nginx:alpine

COPY --from=build /app/apps/oxymore-app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
