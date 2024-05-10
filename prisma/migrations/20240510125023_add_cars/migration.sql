-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    "licensePlate" VARCHAR(10) NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Car_licensePlate_key" ON "Car"("licensePlate");
