/*
  Warnings:

  - The primary key for the `Newsletter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sentDate` on the `Newsletter` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Newsletter` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `Newsletter` table. All the data in the column will be lost.
  - Added the required column `title` to the `Newsletter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Newsletter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Newsletter" DROP CONSTRAINT "Newsletter_pkey",
DROP COLUMN "sentDate",
DROP COLUMN "status",
DROP COLUMN "subject",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "style" JSONB,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Newsletter_id_seq";

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_key" ON "Subscriber"("email");
