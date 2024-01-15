import { Injectable, Logger } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { UserDayData } from "./domain/user-day-data.entity";
import {
  DayDataFilterEnum,
  DayDataTypeEnum,
} from "./interfaces/user-day-data.enum";
import { IUserDayDataRes } from "./interfaces/user-day-data.interface";
import { AppError, ERROR_CODE } from "@configs/index";

@Injectable()
export class UserDayDataService {
  private readonly logger = new Logger(UserDayDataService.name);
  private rankingQueryDataStr: Map<DayDataTypeEnum, string> = new Map();
  private rankingQueryDateStr: Map<DayDataFilterEnum, string> = new Map();

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(UserDayData)
    private readonly repo: Repository<UserDayData>,
  ) {
    this.rankingQueryDataStr[DayDataTypeEnum.REFERRAL] = "ref_count";
    this.rankingQueryDataStr[DayDataTypeEnum.BALANCE] = "balance";
    this.rankingQueryDataStr[DayDataTypeEnum.NETWORK_REVENUE] =
      "network_revenue";
    this.rankingQueryDataStr[DayDataTypeEnum.COMISSION] = "commission";

    this.rankingQueryDateStr[DayDataFilterEnum.ALL] = "7 DAYS";
    this.rankingQueryDateStr[DayDataFilterEnum.ONE_DAY] = "1 DAYS";
    this.rankingQueryDateStr[DayDataFilterEnum.ONE_WEEK] = "7 DAYS";
    this.rankingQueryDateStr[DayDataFilterEnum.ONE_MONTH] = "30 DAYS";
    this.rankingQueryDateStr[DayDataFilterEnum.ONE_YEAR] = "360 DAYS";
  }

  public async handleCron() {
    try {
      const startTime = new Date().getTime();
      await this._updateUserDayData();
      const endTime = new Date().getTime();
      const time = (endTime - startTime) / 1000;
      this.logger.log(`Cronjob update day data done ${time}s`);
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  private async _getUserDayData(): Promise<IUserDayDataRes[]> {
    const rawQueryStr = `
      select
        e."id" as "id",
        a."id" as "userId",
        a."ref_count" as "refCount",
        coalesce(b."network_revenue",0) as "networkRevenue",
        coalesce(c."reward_amount",0) as "commission",
        coalesce(d."reward_amount",0) as "balance"
      from (
        (select "id", "wbxp_balance", "ref_count"
        from wbxp.users) a
        left join
        (select "ref_by_id", sum("wbxp_balance") as "network_revenue"
        from wbxp.users
        group by "ref_by_id") b
        on a."id" = b."ref_by_id"
        left join
        (select "user_id", sum("reward_amount") as "reward_amount"
        from wbxp.rewards
        where "is_claimed" = true
        group by "user_id") c
        ON a."id" = c."user_id"
        left join
        (select "user_id", sum("reward_amount") as "reward_amount"
        from wbxp.do_missions
        where "is_claimed" = true
        group by "user_id") d
        ON a."id" = d."user_id"
        left join
        (select "id", "user_id"
        from wbxp.user_day_data
        where "date" = CURRENT_DATE) e 
        on a."id" = e."user_id"
      )
    `;

    return this.dataSource.query<IUserDayDataRes[]>(rawQueryStr);
  }

  private async _updateUserDayData() {
    const result = await this._getUserDayData();

    const newData = result.map((val) => {
      const userDayData = new UserDayData();
      userDayData.id = val.id;
      userDayData.date = new Date();
      userDayData.userId = val.userId;
      userDayData.balance = val.balance;
      userDayData.commission = val.commission;
      userDayData.refCount = val.refCount;
      userDayData.networkRevenue = val.networkRevenue;

      return userDayData;
    });

    await this.repo.save(newData);
  }
}
