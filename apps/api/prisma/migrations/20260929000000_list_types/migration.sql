BEGIN;
CREATE TYPE "ListType" AS ENUM ('TASK', 'SHOPPING', 'SIMPLE');
ALTER TABLE "Checklist" ADD COLUMN "type" "ListType" NOT NULL DEFAULT 'TASK';
ALTER TABLE "Item" ADD COLUMN "quantity" DECIMAL(12,3), ADD COLUMN "unit" VARCHAR(30), ADD COLUMN "estimatedPrice" DECIMAL(12,2);
ALTER TABLE "Item" ADD CONSTRAINT "Item_quantity_positive" CHECK ("quantity" IS NULL OR "quantity" > 0), ADD CONSTRAINT "Item_price_nonnegative" CHECK ("estimatedPrice" IS NULL OR "estimatedPrice" >= 0);
COMMIT;
