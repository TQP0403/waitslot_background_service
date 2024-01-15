import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DayData } from "./domain/day-data.entity";
import { isDefined } from "class-validator";
import { UserService } from "@modules/user/user.service";
import { ERROR_CODE, AppError } from "@configs/index";

@Injectable()
export class DayDataService {
  private readonly logger = new Logger(DayDataService.name);

  constructor(
    @InjectRepository(DayData)
    private repo: Repository<DayData>,
    private userService: UserService,
  ) {}

  public async handleCron() {
    try {
      const startTime = new Date().getTime();
      await this._updateDayData();
      const endTime = new Date().getTime();
      const time = (endTime - startTime) / 1000;
      this.logger.log(`Cronjob update day data done ${time}s`);
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  private async _updateDayData() {
    const query = this.repo
      .createQueryBuilder("q")
      .where("date = CURRENT_DATE");

    let [result, data] = await Promise.all([
      query.getOne(),
      this.userService.getDayData(),
    ]);

    if (!isDefined(result)) {
      result = new DayData();
      result.date = new Date();
    }
    result.totalBalance = data.totalBalance;
    result.totalHolder = data.totalHolder;

    await this.repo.save(result);
  }
}
