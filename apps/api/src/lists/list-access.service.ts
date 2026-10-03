import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
@Injectable()
export class ListAccessService {
  async lock(
    tx: Prisma.TransactionClient,
    id: string,
    ownerId: string,
    allowDeleted = false,
  ) {
    await tx.$queryRaw`SELECT "id" FROM "Checklist" WHERE "id"=${id} AND "ownerId"=${ownerId} FOR UPDATE`;
    const list = await tx.checklist.findFirst({
      where: { id, ownerId, ...(allowDeleted ? {} : { deletedAt: null }) },
    });
    if (!list) throw new NotFoundException();
    return list;
  }
  writable(list: { archived: boolean }) {
    if (list.archived)
      throw new ConflictException("Unarchive list before editing items");
  }
}
