FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages ./packages

COPY apps/oxymore-admin ./apps/oxymore-admin

RUN npm install
RUN npm run build --workspace=oxymore-admin

FROM nginx:alpine

COPY --from=build /app/apps/oxymore-admin/dist /usr/share/nginx/html

COPY apps/oxymore-admin/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
