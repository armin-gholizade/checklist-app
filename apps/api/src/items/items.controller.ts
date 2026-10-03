import {
  Controller,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import { AuthGuard, AuthRequest } from "../auth";
import { ItemsService } from "./items.service";
import { CreateItemDto, UpdateItemDto, ReorderItemsDto } from "./items.dto";
@Controller("lists/:listId/items")
@UseGuards(AuthGuard)
export class ItemsController {
  constructor(private service: ItemsService) {}
  @Post() add(
    @Req() r: AuthRequest,
    @Param("listId", ParseUUIDPipe) listId: string,
    @Body() b: CreateItemDto,
  ) {
    return this.service.add(r.userId, listId, b);
  }
  @Patch("reorder") reorder(
    @Req() r: AuthRequest,
    @Param("listId", ParseUUIDPipe) listId: string,
    @Body() b: ReorderItemsDto,
  ) {
    return this.service.reorder(r.userId, listId, b.ids);
  }
  @Patch(":id") update(
    @Req() r: AuthRequest,
    @Param("listId", ParseUUIDPipe) listId: string,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() b: UpdateItemDto,
  ) {
    return this.service.update(r.userId, listId, id, b);
  }
  @Delete(":id") remove(
    @Req() r: AuthRequest,
    @Param("listId", ParseUUIDPipe) listId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.service.remove(r.userId, listId, id);
  }
  @Post(":id/restore") restore(
    @Req() r: AuthRequest,
    @Param("listId", ParseUUIDPipe) listId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.service.restore(r.userId, listId, id);
  }
}
