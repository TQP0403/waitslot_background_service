import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./domain/user.entity";
import { IDayData } from "./interfaces/leaderboard.enum";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  public async getDayData(): Promise<IDayData> {
    return this.userRepo
      .createQueryBuilder("q")
      .select("count(1)::int", "totalHolder")
      .addSelect("coalesce(sum(q.wbxp_balance),0)", "totalBalance")
      .where("q.wbxp_balance > 0")
      .getRawOne<IDayData>();
  }
}
