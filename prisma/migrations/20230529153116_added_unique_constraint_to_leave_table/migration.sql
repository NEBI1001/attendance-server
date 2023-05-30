/*
  Warnings:

  - A unique constraint covering the columns `[employeeId,startDate,endDate]` on the table `leave` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "leave_employeeId_startDate_endDate_key" ON "leave"("employeeId", "startDate", "endDate");
