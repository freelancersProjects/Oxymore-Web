FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages ./packages

COPY apps/oxymore-app ./apps/oxymore-app

RUN npm install
RUN npm run build --workspace=oxymore-app

FROM nginx:alpine

COPY --from=build /app/apps/oxymore-app/dist /usr/share/nginx/html

COPY apps/oxymore-app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
