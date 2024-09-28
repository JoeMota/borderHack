/*
  Warnings:

  - You are about to drop the column `salary` on the `Job` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deadline` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedTime` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "salary",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "estimatedTime" INTEGER NOT NULL,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "paymentMethod" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employerId" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
