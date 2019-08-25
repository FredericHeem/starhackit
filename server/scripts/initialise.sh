#!/usr/bin/env sh
cd /app

npm run db:create 2>&1 >/dev/null
npm run db:migrate
npm run start:prod