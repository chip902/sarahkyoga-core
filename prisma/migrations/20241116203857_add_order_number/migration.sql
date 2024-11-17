/*
  Warnings:

  - A unique constraint covering the columns `[orderNumber]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderNumber` to the `Order` table without a default value. This is not possible if the table is not empty.


-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "orderNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- prisma/migrations/20231016123456_add_order_number/migration.sql
*/
-- Add the new column with a temporary default value
ALTER TABLE "Order" ADD COLUMN "orderNumber" TEXT NOT NULL DEFAULT 'TEMP';

-- Update existing rows with unique order numbers
DO $$
DECLARE
    row_id UUID;
BEGIN
    FOR row_id IN SELECT id FROM "Order" LOOP
        UPDATE "Order"
        SET "orderNumber" = (SELECT generate_order_number()::text)
        WHERE id = row_id;
    END LOOP;
END $$;

-- Remove the default value constraint
ALTER TABLE "Order" ALTER COLUMN "orderNumber" DROP DEFAULT;

-- Add a unique constraint to the orderNumber column
ALTER TABLE "Order" ADD CONSTRAINT "Order_orderNumber_key" UNIQUE ("orderNumber");
