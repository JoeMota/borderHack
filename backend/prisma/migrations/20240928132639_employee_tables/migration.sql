/*
  Warnings:

  - You are about to drop the column `image` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `employerId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `revieweeId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewerId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_employerId_fkey";

-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_userId_fkey";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "image",
DROP COLUMN "paymentMethod",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'open';

-- AlterTable
ALTER TABLE "JobApplication" ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "employerId",
ADD COLUMN     "revieweeId" INTEGER NOT NULL,
ADD COLUMN     "reviewerId" INTEGER NOT NULL,
ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "completedJobs" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "hasCompletedSetup" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preferredCategories" TEXT[],
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "skills" TEXT,
ADD COLUMN     "strengths" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Token";

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_revieweeId_fkey" FOREIGN KEY ("revieweeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
