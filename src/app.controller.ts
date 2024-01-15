import { Controller, Get } from "@nestjs/common";
import { AppService } from "app.service";

@Controller("")
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get("/")
  public hello() {
    return this.service.hello();
  }

  @Get("/ping")
  public ping() {
    return this.service.ping();
  }
}
