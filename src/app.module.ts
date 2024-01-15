import { DataSourceConfig } from "@configs/data-source";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "app.controller";
import { AppService } from "app.service";
import { UserDayDataModule } from "@modules/user-day-data/user-day-data.module";
import { DayDataModule } from "@modules/day-data/day-data.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(DataSourceConfig),
    UserDayDataModule,
    DayDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
