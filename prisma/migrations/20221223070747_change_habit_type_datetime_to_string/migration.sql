/*
  Warnings:

  - Made the column `time` on table `habit` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "habit" ALTER COLUMN "time" SET NOT NULL,
ALTER COLUMN "time" SET DATA TYPE TEXT;
