import { prisma } from "../../../../prisma/database";
import { create } from "../../services";

describe("Car service create unit tests", () => {
    beforeEach(async () => {
        await prisma.car.deleteMany();
    })

    test("Should be able to create a Car", async () => {
        const validTestCar = {
            model: "corsa sedan",
            licensePlate: "AAA-1234",
        }

        const receivedValue  = await create(validTestCar);

        const expectedValue = {
            id: expect.any(Number),
            model: validTestCar.model,
            licensePlate: validTestCar.licensePlate
        }

        // VERIFICAR SE FOI CRIADO NO BANCO
        expect(receivedValue).toEqual(expectedValue);

        const createdCar = await prisma.car.findUnique({ where: { id: receivedValue.id }});

        expect(createdCar).toBeTruthy();
    } )

    test("Should throw an error if creating a Car with duplicated license plate", async () => {
        const car1 = {
            model: "corsa sedan",
            licensePlate: "AAA-1234",
        }

        await prisma.car.create({ data: car1 });

        const carWithDuplicatedLicensePlate = {
            model: "Gol",
            licensePlate: "AAA-1234",
        }

        await expect(create(carWithDuplicatedLicensePlate)).rejects.toThrow('License plate already used.')
    } )
})