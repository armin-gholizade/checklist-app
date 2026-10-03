import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards, NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthGuard, AuthRequest } from './auth';
import { ListDto, ItemDto, UpdateItemDto } from './dto';
@Controller('lists') @UseGuards(AuthGuard)
export class ListsController {
 constructor(private db: PrismaService) {}
 private async owned(id:string, ownerId:string) {
  const list = await this.db.checklist.findFirst({where:{id,ownerId}});
  if (!list) throw new NotFoundException(); return list;
 }
 @Get() all(@Req() r:AuthRequest) {return this.db.checklist.findMany({where:{ownerId:r.userId},orderBy:{createdAt:'desc'},include:{items:{select:{id:true,completed:true}}}});}
 @Post() create(@Req() r:AuthRequest,@Body() b:ListDto) {return this.db.checklist.create({data:{title:b.title,ownerId:r.userId}});}
 @Get(':id') async one(@Req() r:AuthRequest,@Param('id',ParseUUIDPipe) id:string) {await this.owned(id,r.userId);return this.db.checklist.findUnique({where:{id},include:{items:{orderBy:{createdAt:'asc'}}}});}
 @Patch(':id') async rename(@Req() r:AuthRequest,@Param('id',ParseUUIDPipe) id:string,@Body() b:ListDto) {await this.owned(id,r.userId);return this.db.checklist.update({where:{id},data:{title:b.title}});}
 @Delete(':id') async remove(@Req() r:AuthRequest,@Param('id',ParseUUIDPipe) id:string) {await this.owned(id,r.userId);return this.db.checklist.delete({where:{id}});}
 @Post(':id/items') async add(@Req() r:AuthRequest,@Param('id',ParseUUIDPipe) id:string,@Body() b:ItemDto) {await this.owned(id,r.userId);return this.db.item.create({data:{listId:id,title:b.title}});}
 @Patch(':id/items/:itemId') async edit(@Req() r:AuthRequest,@Param('id',ParseUUIDPipe) id:string,@Param('itemId',ParseUUIDPipe) itemId:string,@Body() b:UpdateItemDto) {
  await this.owned(id,r.userId); const result=await this.db.item.updateMany({where:{id:itemId,listId:id},data:b}); if(!result.count) throw new NotFoundException(); return {ok:true};
 }
 @Delete(':id/items/:itemId') async deleteItem(@Req() r:AuthRequest,@Param('id',ParseUUIDPipe) id:string,@Param('itemId',ParseUUIDPipe) itemId:string) {
  await this.owned(id,r.userId);const result=await this.db.item.deleteMany({where:{id:itemId,listId:id}});if(!result.count) throw new NotFoundException();return {ok:true};
 }
}
