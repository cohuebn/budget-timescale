import {
  createLogger,
  getOptional,
  getOptionalBool,
  getOptionalInt,
  getRequired,
  getTransformedOptional,
  lazyLoad,
} from "@budget-timescale/core";
import postgres, { Sql } from "postgres";
import asyncRetry from "async-retry";

const defaultDatabaseName = "tsdb";

const logger = createLogger("database/connections");

function getDefaultConnectionSettings() {
  return {
    database: defaultDatabaseName,
    port: 5432,
    ssl: !getOptionalBool("DB_SSL_DISABLED"),
    connection: { timezone: "UTC" },
    max: 5,
    idle_timeout: 2, // Don't hold connections so long
    transform: { undefined: null },
    debug: (...args: unknown[]) => logger.trace(args, "Query trace"),
  };
}

function getConnectionSettingsFromEnvironmentVariables() {
  const defaultSettings = getDefaultConnectionSettings();
  return {
    ...getDefaultConnectionSettings(),
    host: getRequired("DB_HOST"),
    database: getOptional("DB_NAME") ?? defaultSettings.database,
    port: getOptionalInt("DB_PORT", defaultSettings.port),
    username: getRequired("DB_USER"),
    password: getRequired("DB_PASSWORD"),
    ssl: !getOptionalBool("DB_SSL_DISABLED"),
    max: getTransformedOptional("DB_MAX_CONNECTIONS", (value) => parseInt(value, 10)),
  };
}

/**
 * Attempt to make a connection to the database. Run an "is alive" query
 * just to validate the connection was successful. Upon success, return the
 * connection
 * @returns The successful SQL connection
 */
async function attemptConnection(): Promise<Sql> {
  const connectionSettings = getConnectionSettingsFromEnvironmentVariables();
  logger.debug({ ...connectionSettings, password: "<obfuscated>" }, "Connecting to database");
  const newConnection = postgres(connectionSettings);
  // Ensure the connection is valid before using it
  logger.trace("Running alive query");
  const aliveResult = await newConnection`select 1 as databaseAlive`;
  logger.debug({ aliveResult }, "'Is alive' result");
  return newConnection;
}

export async function initializeConnection(): Promise<Sql> {
  return asyncRetry(() => attemptConnection(), {
    retries: 10,
    onRetry: (err, attempt) =>
      logger.warn({ err, attempt }, `Failed to connect to Postgres. Attempt: ${attempt}`),
  });
}

const databaseConnection = lazyLoad(() => initializeConnection());

export async function disconnectFromDatabase() {
  logger.debug("Disconnecting Postgres connection");
  const resolvedConnection = await databaseConnection();
  await resolvedConnection.end();
  logger.debug("Disconnected Postgres connection");
}
