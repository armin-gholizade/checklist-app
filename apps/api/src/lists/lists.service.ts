import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ListAccessService } from "./list-access.service";
import { CreateListDto, UpdateListDto } from "./lists.dto";
@Injectable()
export class ListsService {
  constructor(
    private db: PrismaService,
    private access: ListAccessService,
  ) {}
  all(ownerId: string) {
    return this.db.checklist.findMany({
      where: { ownerId, deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          where: { deletedAt: null },
          select: { id: true, completed: true },
        },
      },
    });
  }
  create(ownerId: string, data: CreateListDto) {
    return this.db.checklist.create({ data: { ...data, ownerId } });
  }
  async one(ownerId: string, id: string) {
    const list = await this.db.checklist.findFirst({
      where: { id, ownerId, deletedAt: null },
      include: {
        items: {
          where: { deletedAt: null },
          orderBy: [{ position: "asc" }, { createdAt: "asc" }, { id: "asc" }],
        },
      },
    });
    if (!list) throw new NotFoundException();
    return list;
  }
  update(ownerId: string, id: string, data: UpdateListDto) {
    return this.db.$transaction(async (tx) => {
      await this.access.lock(tx, id, ownerId);
      return tx.checklist.update({ where: { id }, data });
    });
  }
  remove(ownerId: string, id: string) {
    return this.db.$transaction(async (tx) => {
      await this.access.lock(tx, id, ownerId);
      await tx.checklist.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return { ok: true };
    });
  }
  restore(ownerId: string, id: string) {
    return this.db.$transaction(async (tx) => {
      await this.access.lock(tx, id, ownerId, true);
      return tx.checklist.update({ where: { id }, data: { deletedAt: null } });
    });
  }
}
