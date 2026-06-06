/*
  Warnings:

  - You are about to drop the column `impersonated_by` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `ban_expires` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `ban_reason` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `banned` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "impersonated_by";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "ban_expires",
DROP COLUMN "ban_reason",
DROP COLUMN "banned";
