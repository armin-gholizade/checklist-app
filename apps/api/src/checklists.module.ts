import { Module } from "@nestjs/common";
import { ListsController } from "./lists/lists.controller";
import { ListsService } from "./lists/lists.service";
import { ListAccessService } from "./lists/list-access.service";
import { ItemsController } from "./items/items.controller";
import { ItemsService } from "./items/items.service";
import { AuthModule } from "./auth.module";
import { DatabaseModule } from "./database.module";
@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [ListsController, ItemsController],
  providers: [ListsService, ListAccessService, ItemsService],
})
export class ChecklistsModule {}
