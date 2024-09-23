/*
  Warnings:

  - You are about to alter the column `ref_type` on the `merchant_channel` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "merchant_channel" ALTER COLUMN "ref_type" SET DATA TYPE VARCHAR(100);

-- CreateTable
CREATE TABLE "femto_application" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "app_id" VARCHAR(50) NOT NULL,
    "app_name" VARCHAR(50) NOT NULL,
    "topic" VARCHAR(100) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "femto_application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "femto_application_app_id_key" ON "femto_application"("app_id");
