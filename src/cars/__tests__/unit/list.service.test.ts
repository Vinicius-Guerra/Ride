import { prisma } from "../../../../prisma/database";
import { list } from "../../services";

describe("Car service list unit tests", () => {
  beforeAll(async () => {
    await prisma.car.deleteMany();
  });

  test("Should be able to list all Cars", async () => {
    const validTestCars = [
      {
        model: "Model WXYZ",
        licensePlate: "AAA-1111",
      },
      {
        model: "Model XPTO",
        licensePlate: "BBB-2222",
      },
      {
        model: "Model ABCD",
        licensePlate: "CCC-3333",
      },
    ];

    await prisma.car.createMany({ data: validTestCars });

    const receivedValue = await list();
    const expectedValue = [
      {
        id: expect.any(Number),
        model: "Model WXYZ",
        licensePlate: "AAA-1111",
      },
      {
        id: expect.any(Number),
        model: "Model XPTO",
        licensePlate: "BBB-2222",
      },
      {
        id: expect.any(Number),
        model: "Model ABCD",
        licensePlate: "CCC-3333",
      },
    ];

    expect(receivedValue).toEqual(expectedValue);
  });
});