import { DataSource, DataSourceOptions } from "typeorm";
import * as path from "path";
import { Logger } from "@nestjs/common";
import { env } from "./environment-variable";

const _path = path.resolve(
  __dirname + "/../modules/**/domain/*.entity{.ts,.js}",
);

const logger = new Logger("DataSource");

export const DataSourceConfig: DataSourceOptions = {
  type: "postgres",
  host: env.database.host,
  port: env.database.port,
  username: env.database.username,
  password: env.database.password,
  database: env.database.database,
  entities: [_path],
  synchronize: false,
  migrations: ["dist/migrations/*js"],
  schema: env.database.schema,
  logging: env.database.logging,
  connectTimeoutMS: env.database.timeout, // default 10s
  applicationName: env.database.appName,
  ssl: env.database.ssl,
  extra: {
    poolSize: env.database.poolSize,
    query_timeout: env.database.timeout,
    statement_timeout: env.database.timeout,
    ssl: { rejectUnauthorized: false },
  },
};

export const AppDataSource = new DataSource(DataSourceConfig);
AppDataSource.initialize().then(() => {
  logger.log("AppDataSource connected");
});
