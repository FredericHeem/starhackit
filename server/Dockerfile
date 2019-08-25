FROM node:11 as build

ENV GIT_SSH_COMMAND "ssh -i ~/.ssh/id_ecdsa -o BatchMode=yes -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"

WORKDIR /app

COPY package.json .
#COPY package-lock.json .
#COPY git_private_key /tmp/git_private_key

#RUN mkdir -p /root/.ssh/ && \
#    chmod 0700 ~/.ssh && \
#    mv /tmp/git_private_key ~/.ssh/id_ecdsa && \
#    chmod 0600 ~/.ssh/id_ecdsa && \
RUN npm install

COPY . .

RUN npm run build

FROM node:11-alpine

WORKDIR /app

COPY --from=build /app .

EXPOSE 4000

ENTRYPOINT ["npm", "run", "server"]
