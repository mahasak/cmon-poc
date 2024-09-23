-- CreateTable
CREATE TABLE "sequencers" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "data" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "sequencers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facebook_pages" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "page_id" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "access_token" VARCHAR(500) NOT NULL,
    "p2m_ph" BOOLEAN NOT NULL DEFAULT false,
    "bankslip_api" BOOLEAN NOT NULL DEFAULT false,
    "p2m_th" BOOLEAN NOT NULL DEFAULT false,
    "pipeline" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "facebook_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchant_channel" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "ref_id" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "ref_type" TEXT NOT NULL,
    "token" VARCHAR(500) NOT NULL,

    CONSTRAINT "merchant_channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_registry" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "ref_id" VARCHAR(50) NOT NULL,
    "app_id" VARCHAR(50) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "application_registry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sequencers_name_key" ON "sequencers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "facebook_pages_page_id_key" ON "facebook_pages"("page_id");

-- CreateIndex
CREATE UNIQUE INDEX "merchant_channel_ref_id_ref_type_key" ON "merchant_channel"("ref_id", "ref_type");

-- CreateIndex
CREATE UNIQUE INDEX "application_registry_ref_id_app_id_key" ON "application_registry"("ref_id", "app_id");
