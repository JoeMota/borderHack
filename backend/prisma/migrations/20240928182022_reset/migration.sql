/*
  Warnings:

  - You are about to drop the column `status` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `revieweeId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `reviewerId` on the `Review` table. All the data in the column will be lost.
  - You are about to alter the column `rating` on the `Review` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `completedJobs` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hasCompletedSetup` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `preferredCategories` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `strengths` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `paymentMethod` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employerId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_revieweeId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_reviewerId_fkey";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "status",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "paymentMethod" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "JobApplication" ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "revieweeId",
DROP COLUMN "reviewerId",
ADD COLUMN     "employerId" INTEGER NOT NULL,
ALTER COLUMN "rating" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "completedJobs",
DROP COLUMN "hasCompletedSetup",
DROP COLUMN "preferredCategories",
DROP COLUMN "rating",
DROP COLUMN "skills",
DROP COLUMN "strengths",
DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_refreshToken_key" ON "Token"("refreshToken");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
