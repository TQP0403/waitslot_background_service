import { Controller, Get } from "@nestjs/common";
import { DayDataService } from "./day-data.service";

// @Controller("day-data")
@Controller("")
export class DayDataController {
  constructor(private readonly service: DayDataService) {}

  @Get("/")
  async runJob() {
    return await this.service.handleCron();
  }
}
