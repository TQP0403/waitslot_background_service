import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DayData } from "./domain/day-data.entity";
import { DayDataController } from "./day-data.controller";
import { DayDataService } from "./day-data.service";
import { UserModule } from "@modules/user/user.module";
import { DataSourceConfig } from "@configs/data-source";

@Module({
  imports: [
    TypeOrmModule.forRoot(DataSourceConfig),
    TypeOrmModule.forFeature([DayData]),
    UserModule,
  ],
  controllers: [DayDataController],
  providers: [DayDataService],
})
export class DayDataModule {}
