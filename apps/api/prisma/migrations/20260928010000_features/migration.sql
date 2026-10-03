BEGIN;

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'NORMAL', 'HIGH');

-- AlterTable
ALTER TABLE "Checklist" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "description" VARCHAR(2000) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "dueDate" VARCHAR(10),
ADD COLUMN     "notes" VARCHAR(4000) NOT NULL DEFAULT '',
ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'NORMAL';


-- Preserve the original creation order for existing items.
WITH ranked AS (
 SELECT "id", ROW_NUMBER() OVER(PARTITION BY "listId" ORDER BY "createdAt", "id") - 1 AS pos FROM "Item"
)
UPDATE "Item" SET "position"=ranked.pos::integer FROM ranked WHERE "Item"."id"=ranked."id";

COMMIT;
