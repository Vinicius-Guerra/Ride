-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "driverId" INTEGER NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "dateOfBirth" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Car_licensePlate_key" ON "Car"("licensePlate");

-- CreateIndex
CREATE UNIQUE INDEX "Car_driverId_key" ON "Car"("driverId");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
