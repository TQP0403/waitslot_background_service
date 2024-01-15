import { Controller, Get } from "@nestjs/common";
import { UserDayDataService } from "./user-day-data.service";

// @Controller("user-day-data")
@Controller("")
export class UserDayDataController {
  constructor(private readonly service: UserDayDataService) {}

  @Get("/")
  async runJob() {
    return await this.service.handleCron();
  }
}
