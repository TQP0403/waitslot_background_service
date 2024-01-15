import { NestFactory } from "@nestjs/core";
import { createServer, proxy } from "@vendia/serverless-express";
import { eventContext } from "@vendia/serverless-express/middleware";

import { Callback, Context, Handler } from "aws-lambda";
import { Server } from "http";
import express from "express";
import { ExpressAdapter } from "@nestjs/platform-express";
import { DayDataModule } from "./day-data.module";

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

let cachedServer: Server;

async function bootstrapServer(): Promise<Server> {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(
      DayDataModule,
      new ExpressAdapter(expressApp),
    );
    app.use(eventContext());
    await app.init();
    cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
  }
  return cachedServer;
}

export const handler: Handler = async (event: any, context: Context) => {
  cachedServer = await bootstrapServer();
  return proxy(cachedServer, event, context, "PROMISE").promise;
};
