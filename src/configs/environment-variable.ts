import "dotenv/config";

export const env = {
  database: {
    host: process.env.TYPEORM_HOST || "localhost",
    port: Number(process.env.TYPEORM_PORT) || 5432,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    schema: process.env.TYPEORM_SCHEMA,
    appName: process.env.APP_NAME || "api-default",
    ssl: process.env.TYPEORM_SSL === "true",
    logging: process.env.TYPEORM_LOGGING === "true",
    timeout: Number(process.env.TYPEORM_TIMEOUT) || 10000,
    poolSize: Number(process.env.TYPEORM_POOLSIZE) || 10,
  },
};
