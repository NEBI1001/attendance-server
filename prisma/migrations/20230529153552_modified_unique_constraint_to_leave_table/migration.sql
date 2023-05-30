/*
  Warnings:

  - A unique constraint covering the columns `[employeeId,startDate]` on the table `leave` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "leave_employeeId_startDate_endDate_key";

-- CreateIndex
CREATE UNIQUE INDEX "leave_employeeId_startDate_key" ON "leave"("employeeId", "startDate");
