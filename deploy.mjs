#!/usr/bin/env zx

await $`git pull`
await $`cd frontend && npm i`
await $`cd backend && npm i`

await $`cd frontend && npm run build`
await $`rm -rf backend/frontend_build`
await $`cp -r frontend/build backend/frontend_build`

await $`cd backend && npx prisma db push`
await $`cd backend && npm run build`

