/*
  Warnings:

  - You are about to drop the column `ref_id` on the `application_registry` table. All the data in the column will be lost.
  - The `app_id` column on the `application_registry` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `femto_application` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[channel_id,app_id]` on the table `application_registry` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "application_registry_ref_id_app_id_key";

-- AlterTable
ALTER TABLE "application_registry" DROP COLUMN "ref_id",
ADD COLUMN     "channel_id" INTEGER,
DROP COLUMN "app_id",
ADD COLUMN     "app_id" INTEGER;

-- DropTable
DROP TABLE "femto_application";

-- CreateTable
CREATE TABLE "application" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "app_id" VARCHAR(50) NOT NULL,
    "app_name" VARCHAR(50) NOT NULL,
    "topic" VARCHAR(100) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "application_app_id_key" ON "application"("app_id");

-- CreateIndex
CREATE UNIQUE INDEX "application_registry_channel_id_app_id_key" ON "application_registry"("channel_id", "app_id");

-- AddForeignKey
ALTER TABLE "application_registry" ADD CONSTRAINT "application_registry_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "merchant_channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_registry" ADD CONSTRAINT "application_registry_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
