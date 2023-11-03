FROM node:20-alpine as build

ARG BUILD_VERSION
ENV BUILD_VERSION $BUILD_VERSION
ENV PUPPETEER_SKIP_DOWNLOAD true

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /app


COPY package.json .
#COPY package-lock.json .

RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine-slim
WORKDIR /app

COPY --from=build /app/dist /usr/html/
COPY --from=build /app/robots.txt /usr/html/
COPY nginx.conf /etc/nginx

EXPOSE 3000