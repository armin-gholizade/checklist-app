import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { assertItemFieldsForType } from "./item-type-policy";
import { PrismaService } from "../prisma.service";
import { ListAccessService } from "../lists/list-access.service";
import { CreateItemDto, UpdateItemDto } from "./items.dto";
@Injectable()
export class ItemsService {
  constructor(
    private db: PrismaService,
    private access: ListAccessService,
  ) {}
  add(ownerId: string, listId: string, data: CreateItemDto) {
    return this.db.$transaction(async (tx) => {
      const list = await this.access.lock(tx, listId, ownerId);
      this.access.writable(list);
      assertItemFieldsForType(list.type, data);
      const max = await tx.item.aggregate({
        where: { listId, deletedAt: null },
        _max: { position: true },
      });
      return tx.item.create({
        data: {
          ...data,
          ...(list.type === "SHOPPING" ? { quantity: data.quantity ?? 1, unit: data.unit ?? "عدد" } : {}),
          listId,
          position: (max._max.position ?? -1) + 1,
        },
      });
    });
  }
  update(ownerId: string, listId: string, id: string, data: UpdateItemDto) {
    return this.db.$transaction(async (tx) => {
      const list = await this.access.lock(tx, listId, ownerId);
      this.access.writable(list);
      assertItemFieldsForType(list.type, data);
      const result = await tx.item.updateMany({
        where: { id, listId, deletedAt: null },
        data,
      });
      if (!result.count) throw new NotFoundException();
      return { ok: true };
    });
  }
  remove(ownerId: string, listId: string, id: string) {
    return this.db.$transaction(async (tx) => {
      this.access.writable(await this.access.lock(tx, listId, ownerId));
      const result = await tx.item.updateMany({
        where: { id, listId, deletedAt: null },
        data: { deletedAt: new Date() },
      });
      if (!result.count) throw new NotFoundException();
      return { ok: true };
    });
  }
  restore(ownerId: string, listId: string, id: string) {
    return this.db.$transaction(async (tx) => {
      this.access.writable(await this.access.lock(tx, listId, ownerId));
      const item = await tx.item.findFirst({ where: { id, listId } });
      if (!item) throw new NotFoundException();
      if (!item.deletedAt) return { ok: true };
      await tx.item.update({ where: { id }, data: { deletedAt: null } });
      const ordered = await tx.item.findMany({
        where: { listId, deletedAt: null },
        orderBy: [{ position: "asc" }, { createdAt: "asc" }, { id: "asc" }],
        select: { id: true },
      });
      for (const [position, i] of ordered.entries())
        await tx.item.update({ where: { id: i.id }, data: { position } });
      return { ok: true };
    });
  }
  reorder(ownerId: string, listId: string, ids: string[]) {
    return this.db.$transaction(
      async (tx) => {
        this.access.writable(await this.access.lock(tx, listId, ownerId));
        const current = await tx.item.findMany({
          where: { listId, deletedAt: null },
          select: { id: true },
        });
        const wanted = new Set(ids);
        if (
          wanted.size !== ids.length ||
          current.length !== ids.length ||
          current.some((i) => !wanted.has(i.id))
        )
          throw new ConflictException("List changed; reload before reordering");
        for (const [position, id] of ids.entries())
          await tx.item.update({ where: { id }, data: { position } });
        return { ok: true };
      },
      { timeout: 15000 },
    );
  }
}
