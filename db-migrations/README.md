# DB Migrations

Repeatable migrations using Flyway to get our database setup. Any database changes should go through here
to facilitate repeatable environments.

## Local run

To spin up a local Postgres database and run migrations against it, use this command:
`docker compose -f local.docker-compose.yml --env-file local.env up --build --force-recreate`

To tear down that local database, run:
`docker compose -f local.docker-compose.yml --env-file local.env down`
