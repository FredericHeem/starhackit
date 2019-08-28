FROM node:11 as build

ARG BUILD_VERSION
ENV BUILD_VERSION $BUILD_VERSION

WORKDIR /app

COPY package.json .
#COPY package-lock.json .

RUN npm install
COPY . .

RUN npm run build

FROM smebberson/alpine-nginx
WORKDIR /app
COPY --from=build /app/dist /usr/html/
EXPOSE 80