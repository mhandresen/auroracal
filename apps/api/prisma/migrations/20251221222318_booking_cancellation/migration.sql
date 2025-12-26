/*
  Warnings:

  - A unique constraint covering the columns `[cancelToken]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cancelToken` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "cancelToken" TEXT NOT NULL,
ADD COLUMN     "cancelledAt" TIMESTAMPTZ(6);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_cancelToken_key" ON "Booking"("cancelToken");

-- CreateIndex
CREATE INDEX "Booking_cancelToken_idx" ON "Booking"("cancelToken");
