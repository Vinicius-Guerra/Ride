import { prisma } from "../../../@shared/database/database";
import { listCarService } from "../../services";

describe("Car service list unit tests", () => {
  beforeAll(async () => {
    await prisma.car.deleteMany();
  });

  afterAll(async () => {
    await prisma.car.deleteMany();
    await prisma.driver.deleteMany();
  });

  test("Should be able to list all Cars", async () => {
    // SETUP
    const driversData = [
      {
        email: "something@mail.com",
        password: "1234",
        firstName: "Chrystian",
        lastName: "Rodolfo",
      },
      {
        email: "something2@mail.com",
        password: "1234",
        firstName: "Some First Name",
        lastName: "Some LastName",
      },
    ];

    const driver1 = await prisma.driver.create({ data: driversData[0] });
    const driver2 = await prisma.driver.create({ data: driversData[1] });

    const validTestCars = [
      {
        model: "Model WXYZ",
        licensePlate: "AAA-1111",
        driverId: driver1.id,
      },
      {
        model: "Model XPTO",
        licensePlate: "BBB-2222",
        driverId: driver2.id,
      },
    ];

    await prisma.car.createMany({ data: validTestCars });

    const receivedValue = await listCarService();
    const expectedValue = [
      {
        id: expect.any(Number),
        model: "Model WXYZ",
        licensePlate: "AAA-1111",
        driverId: driver1.id,
      },
      {
        id: expect.any(Number),
        model: "Model XPTO",
        licensePlate: "BBB-2222",
        driverId: driver2.id,
      },
    ];

    // EXPECT -> ASSERT
    expect(receivedValue).toEqual(expectedValue);
  });
});
