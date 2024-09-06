# Messages API

A REST API for a messaging application. Built using TypeScript, Express, and Prisma. Also uses Redis for session storage and Jest for testing.

## Requirements

1. pnpm or similar.
2. A running Postgres database.
3. A running Redis database.

## Running

1. Install packages with `pnpm install`
2. Create a `.env.local` file that follows `.env.example`.
3. Set up database with `pnpm run migrate-db`.
4. Run with `pnpm run start` or `pnpm run watch`.

## Testing

1. Install packages with `pnpm install`
2. Create a `.env.test` file that follows `.env.example`.
3. Set up database with `pnpm run test:migrate-db`.
4. Run with `pnpm run test`.
