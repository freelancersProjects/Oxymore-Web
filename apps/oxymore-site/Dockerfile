FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages ./packages

COPY apps/oxymore-site ./apps/oxymore-site

RUN npm install
RUN npm run build --workspace=oxymore-site

FROM nginx:alpine

COPY --from=build /app/apps/oxymore-site/dist /usr/share/nginx/html

COPY apps/oxymore-site/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
