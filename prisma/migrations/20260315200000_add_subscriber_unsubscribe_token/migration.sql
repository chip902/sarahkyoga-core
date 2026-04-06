-- AlterTable
ALTER TABLE "Subscriber" ADD COLUMN "unsubscribeToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_unsubscribeToken_key" ON "Subscriber"("unsubscribeToken");
