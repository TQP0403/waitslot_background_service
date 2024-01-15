import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserDayDataService } from "./user-day-data.service";
import { UserDayData } from "./domain/user-day-data.entity";
import { UserDayDataController } from "./user-day-data.controller";
import { DataSourceConfig } from "@configs/data-source";

@Module({
  imports: [
    TypeOrmModule.forRoot(DataSourceConfig),
    TypeOrmModule.forFeature([UserDayData]),
  ],
  controllers: [UserDayDataController],
  providers: [UserDayDataService],
})
export class UserDayDataModule {}
