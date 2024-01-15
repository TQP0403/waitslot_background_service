import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor() {}

  public hello(): string {
    return "Hello World";
  }

  public ping(): string {
    return "pong";
  }
}
