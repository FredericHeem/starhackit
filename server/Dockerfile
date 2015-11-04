FROM node:5

RUN mkdir /app

WORKDIR /app
ADD package.json /app/package.json
RUN npm install --loglevel warn

EXPOSE 3000

CMD npm start
