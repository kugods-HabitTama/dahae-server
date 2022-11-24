/*
  Warnings:

  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `unit` on the `habit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `day` on the `habit_record` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `pet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `os` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "user_os" AS ENUM ('ANDROID', 'IOS');

-- CreateEnum
CREATE TYPE "pet_type" AS ENUM ('Tiger', 'Eagle');

-- CreateEnum
CREATE TYPE "habit_unit" AS ENUM ('cm', 'g', 'ml');

-- CreateEnum
CREATE TYPE "habit_record_day" AS ENUM ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');

-- AlterTable
ALTER TABLE "habit" DROP COLUMN "unit",
ADD COLUMN     "unit" "habit_unit" NOT NULL;

-- AlterTable
ALTER TABLE "habit_record" DROP COLUMN "day",
ADD COLUMN     "day" "habit_record_day" NOT NULL;

-- AlterTable
ALTER TABLE "pet" DROP COLUMN "type",
ADD COLUMN     "type" "pet_type" NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role",
ADD COLUMN     "role" "user_role" NOT NULL DEFAULT 'USER',
DROP COLUMN "os",
ADD COLUMN     "os" "user_os" NOT NULL;

-- DropEnum
DROP TYPE "Day";

-- DropEnum
DROP TYPE "OS";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "Type";

-- DropEnum
DROP TYPE "Unit";
