/*
  Warnings:

  - You are about to drop the column `memo` on the `habit` table. All the data in the column will be lost.
  - The `time` column on the `habit` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `unit` on the `habit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "habit" DROP COLUMN "memo",
DROP COLUMN "time",
ADD COLUMN     "time" TIME,
ALTER COLUMN "start_date" SET DATA TYPE DATE,
ALTER COLUMN "end_date" SET DATA TYPE DATE,
DROP COLUMN "unit",
ADD COLUMN     "unit" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "habit_record" ALTER COLUMN "date" SET DATA TYPE DATE;

-- DropEnum
DROP TYPE "habit_unit";
