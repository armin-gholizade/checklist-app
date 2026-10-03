import {
  Controller,
  Get,
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
import { ListsService } from "./lists.service";
import { CreateListDto, UpdateListDto } from "./lists.dto";
@Controller("lists")
@UseGuards(AuthGuard)
export class ListsController {
  constructor(private service: ListsService) {}
  @Get() all(@Req() r: AuthRequest) {
    return this.service.all(r.userId);
  }
  @Post() create(@Req() r: AuthRequest, @Body() b: CreateListDto) {
    return this.service.create(r.userId, b);
  }
  @Get(":id") one(
    @Req() r: AuthRequest,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.service.one(r.userId, id);
  }
  @Patch(":id") update(
    @Req() r: AuthRequest,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() b: UpdateListDto,
  ) {
    return this.service.update(r.userId, id, b);
  }
  @Delete(":id") remove(
    @Req() r: AuthRequest,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.service.remove(r.userId, id);
  }
  @Post(":id/restore") restore(
    @Req() r: AuthRequest,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.service.restore(r.userId, id);
  }
}
