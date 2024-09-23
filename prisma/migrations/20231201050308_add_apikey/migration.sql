-- CreateTable
CREATE TABLE "api_key" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "key_name" VARCHAR(100) NOT NULL,
    "key_content" VARCHAR(500) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "api_key_pkey" PRIMARY KEY ("id")
);
